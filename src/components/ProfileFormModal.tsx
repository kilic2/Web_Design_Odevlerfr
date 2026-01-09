import {
    Button,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    TextInput,
    FileInput
} from "flowbite-react";
import { useState, useEffect } from "react";
import { api } from "../helper/api";
import { toast } from "sonner";

interface Props {
    show: boolean;
    setShow: (show: boolean) => void;
    loginType: boolean;
    onLoginSuccess: (userId: number) => void;
}

interface Tag {
    id: number;
    name: string;
}

export const ProfileFormModal = ({ show, setShow, loginType, onLoginSuccess }: Props) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rpPassword, setRpPassword] = useState("");
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [loadingTags, setLoadingTags] = useState(false);
    const [photo, setPhoto] = useState<File | null>(null);

    useEffect(() => {
        if (show && !loginType) {
            fetchTags();
        }
    }, [show, loginType]);

    const fetchTags = async () => {
        setLoadingTags(true);
        try {
            const response = await api.get('/tag');
            setAvailableTags(response.data);
        } catch (error) {
            console.error(error);
            toast.error('İlgi alanları yüklenemedi');
        } finally {
            setLoadingTags(false);
        }
    };

    const toggleTag = (tagId: number) => {
        setSelectedTags(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    };

    function handleSave() {
        if (loginType) {
            if (!username || !password) {
                toast.error("Kullanıcı adı ve şifre gerekli");
                return;
            }

            api.get("/profiles")
                .then((response) => {
                    const users = response.data;
                    const foundUser = users.find((u: any) => u.username === username && u.password === password);

                    if (foundUser) {
                        toast.success("Giriş başarılı");
                        onLoginSuccess(foundUser.id);
                        resetForm();
                        setShow(false);
                    } else {
                        toast.error("Kullanıcı adı veya şifre hatalı");
                    }
                })
                .catch((err) => {
                    toast.error("Giriş işlemi başarısız");
                });
        } else {
            if (!username || !email || !password) {
                toast.error("Tüm alanlar gerekli");
                return;
            }

            if (password !== rpPassword) {
                toast.error("Şifreler eşleşmiyor");
                return;
            }

            if (selectedTags.length === 0) {
                toast.error("En az bir ilgi alanı seçmelisiniz");
                return;
            }

            const formData = new FormData();
            formData.append("username", username);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("rpPassword", rpPassword);
            formData.append("profileTypeId", "1");

            if (photo) {
                formData.append("photo", photo);
            }

            selectedTags.forEach(tagId => {
                formData.append("tagIds", tagId.toString());
            });

            api.post("/profiles", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then((response) => {
                    toast.success("Kaydol başarılı");
                    onLoginSuccess(response.data.id);
                    resetForm();
                    setShow(false);
                })
                .catch((err) => {
                    const msg = err.response?.data?.message || "Kaydol başarısız";
                    toast.error(Array.isArray(msg) ? msg[0] : msg);
                });
        }
    }

    const resetForm = () => {
        setUsername("");
        setEmail("");
        setPassword("");
        setRpPassword("");
        setSelectedTags([]);
        setPhoto(null);
    };

    return (
        <Modal show={show} size="lg" onClose={() => {
            resetForm();
            setShow(false);
        }} popup>
            <ModalHeader>
                {loginType ? "Giriş Yap" : "Kaydol"}
            </ModalHeader>
            <ModalBody>
                <div className="space-y-6">
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="u">Kullanıcı Adı</Label>
                        </div>
                        <TextInput
                            id="u"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    {!loginType && (
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="e">Email</Label>
                            </div>
                            <TextInput
                                id="e"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    )}

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="p">Şifre</Label>
                        </div>
                        <TextInput
                            id="p"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {!loginType && (
                        <>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="rp">Şifre Tekrar</Label>
                                </div>
                                <TextInput
                                    id="rp"
                                    type="password"
                                    value={rpPassword}
                                    onChange={(e) => setRpPassword(e.target.value)}
                                />
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="photo">Profil Fotoğrafı</Label>
                                </div>
                                <FileInput
                                    id="photo"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setPhoto(e.target.files[0]);
                                        }
                                    }}
                                />
                            </div>

                            <div>
                                <div className="mb-3 block">
                                    <Label>İlgi Alanlarınız</Label>
                                    <p className="text-sm text-gray-500 mt-1">
                                        İlgilendiğiniz konuları seçin ({selectedTags.length} seçildi)
                                    </p>
                                </div>

                                {loadingTags ? (
                                    <div className="text-center py-4">
                                        <p className="text-gray-500">Yükleniyor...</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {availableTags.map((tag) => (
                                            <button
                                                key={tag.id}
                                                type="button"
                                                onClick={() => toggleTag(tag.id)}
                                                className={`
                          px-4 py-2 rounded-full text-sm font-medium
                          transition-all duration-200 transform
                          ${selectedTags.includes(tag.id)
                                                        ? 'bg-blue-600 text-white scale-105 shadow-lg'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                                                    }
                        `}
                                            >
                                                {selectedTags.includes(tag.id) && (
                                                    <span className="mr-1">✓</span>
                                                )}
                                                {tag.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <div className="w-full">
                        <Button onClick={handleSave} className="w-full">
                            {loginType ? "Giriş Yap" : "Kaydol"}
                        </Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
}