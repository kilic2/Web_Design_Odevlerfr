import {
    Avatar,
    Dropdown,
    DropdownDivider,
    DropdownHeader,
    DropdownItem,
    Navbar,
    NavbarBrand,
    NavbarToggle,
    Table,
} from "flowbite-react";
import { useState, useEffect } from "react";
import { useNavigate, Routes, Route, Link } from "react-router-dom";
import { ProfileFormModal } from "./components/ProfileFormModal";
import { api } from "./helper/api";
import ReviewCard from "./components/ReviewCard";
import type { Review } from "./types/Profile";
import ReviewContent from "./components/ReviewContent";
import ProfileTable from "./components/ProfileTable";

function AdminPanel() {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        api.get('/profiles')
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Kullanıcı Yönetimi</h2>
            <div className="overflow-x-auto">
                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>ID</Table.HeadCell>
                        <Table.HeadCell>Kullanıcı Adı</Table.HeadCell>
                        <Table.HeadCell>Email</Table.HeadCell>
                        <Table.HeadCell>Rol ID</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {users.map((user) => (
                            <Table.Row key={user.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {user.id}
                                </Table.Cell>
                                <Table.Cell>{user.username}</Table.Cell>
                                <Table.Cell>{user.email}</Table.Cell>
                                <Table.Cell>{user.profileTypeId}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        </div>
    );
}

function App() {
    const [loginType, setLoginType] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);

    const [user, setUser] = useState({
        isLoggedIn: false,
        isAdmin: 2,
        id: null as number | null,
        name: "",
        pp: "",
        mail: ""
    });

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get('/review');
                const formattedData: Review[] = response.data.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    desc: item.desc,
                    img: item.img,
                    date: new Date(item.date),
                    comments: item.comments || []
                }));
                setReviews(formattedData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchReviews();
    }, []);

    const handleLoginSuccess = (userId: number) => {
        api.get(`profiles/${userId}`)
            .then((response) => {
                setUser({
                    isLoggedIn: true,
                    isAdmin: response.data.profileTypeId,
                    id: userId,
                    name: response.data.username,
                    pp: response.data.photo || "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
                    mail: response.data.email
                });
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const handleLogout = () => {
        setUser({
            isLoggedIn: false,
            isAdmin: 2,
            id: null,
            name: "",
            pp: "",
            mail: ""
        });
        navigate('/');
    };

    const navigate = useNavigate();

    return (
        <>
            <Navbar fluid rounded>
                <NavbarBrand
                    onClick={() => {
                        setShowModal(false);
                        navigate('/');
                    }}
                    className="cursor-pointer"
                >
                    <img src="\Gemini_Generated_Image_rj5920rj5920rj59.png" className="mr-3 h-6 sm:h-9" alt="Logo" />
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Donanım Forum</span>
                </NavbarBrand>

                <div className="flex md:order-2">
                    {user.isLoggedIn ? (
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <Avatar alt="User settings" img={user.pp} rounded />
                            }
                        >
                            <DropdownHeader>
                                <span className="block text-sm">{user.name}</span>
                                <span className="block truncate text-sm font-medium">{user.mail}</span>
                            </DropdownHeader>
                            {user.isAdmin === 2 && (
                                <DropdownItem onClick={() => navigate('/admin')}>
                                    Admin Paneli
                                </DropdownItem>
                            )}
                            <DropdownDivider />
                            <DropdownItem onClick={handleLogout}>Çıkış yap</DropdownItem>
                        </Dropdown>
                    ) : (
                        <>
                            <button
                                className="text-white px-4 py-2 rounded-lg hover:bg-blue-800"
                                onClick={() => { setLoginType(true); setShowModal(true); }}
                            >
                                Giriş Yap
                            </button>

                            <button
                                className="ml-4 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                onClick={() => { setLoginType(false); setShowModal(true); }}
                            >
                                Kayıt Ol
                            </button>
                        </>
                    )}
                    <NavbarToggle />
                </div>
            </Navbar>

            <main className="bg-gray-50 min-h-screen p-4">
                <Routes>
                    <Route path="/" element={
                        <>
                            <div style={{ backgroundColor: '#ffffff', padding: '80px 0', borderBottom: '1px solid #e5e7eb', marginBottom: '2rem' }}>
                                <div className="container mx-auto px-4 text-center">
                                    <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#000000', marginBottom: '1rem', textTransform: 'uppercase' }}>
                                        Güncel Donanım İncelemeleri
                                    </h1>
                                    <p style={{ fontSize: '1.25rem', color: '#6b7280', maxWidth: '48rem', margin: '0 auto' }}>
                                        En son teknoloji ürünlerinin detaylı analizleri ve performans testleri
                                    </p>
                                </div>
                            </div>
                            <div className="container mx-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {reviews.map((item) => (
                                        <Link to={`/discussion/${item.id}`} key={item.id}>
                                            <ReviewCard
                                                title={item.title}
                                                desc={item.desc}
                                                img={item.img}
                                                date={item.date}
                                            />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </>
                    } />
                    <Route path="/discussion/:id" element={<ReviewContent user={user} />} />
                    <Route
                        path="/admin"
                        element={
                            // Kullanıcı admin ise Tabloyu göster, değilse Ana Sayfaya at
                            (user.isAdmin === 2) ? (
                                <div className="container mx-auto mt-10 p-4">
                                    <h2 className="text-2xl font-bold mb-4">Yönetici Paneli</h2>
                                    <ProfileTable />
                                </div>
                            ) : (
                                <div className="text-center mt-10">Yetkiniz yok!</div>
                            )
                        }
                    />
                </Routes>
            </main>

            <ProfileFormModal
                show={showModal}
                setShow={setShowModal}
                loginType={loginType}
                onLoginSuccess={handleLoginSuccess}
            />
        </>
    );
}

export default App;