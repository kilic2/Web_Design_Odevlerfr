import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    TableCell,
    TableRow,
    Badge, // Tagleri güzel göstermek için Badge ekledim
    Avatar, // Fotoyu göstermek için Avatar ekledim
} from "flowbite-react";
import type { Profile } from "../types/Profile";
import { ProfileFormModal } from "./ProfileFormModal";
import { FaTrash } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useState } from "react";
import { api } from "../helper/api";
import { toast } from "sonner";

interface Props {
    fetchProfiles: () => void;
    profile: Profile;
    handleClick: (profile: Profile) => void;
}

export const ProfileRow = ({ fetchProfiles, profile, handleClick }: Props) => {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Modal
                show={showDelete}
                size="md"
                onClose={() => setShowDelete(false)}
                popup
            >
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Bu profili silmek istediğinize emin misiniz?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button
                                color="red"
                                onClick={() => {
                                    api
                                        .request({
                                            url: "profiles/" + profile.id,
                                            method: "delete",
                                        })
                                        .then(() => {
                                            fetchProfiles();
                                            setShowDelete(false);
                                            toast.success("Profil silindi");
                                        })
                                        .catch(() => toast.error("Bir hata oluştu"));
                                }}
                            >
                                Evet, eminim
                            </Button>
                            <Button color="alternative" onClick={() => setShowDelete(false)}>
                                Hayır, iptal
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>

            <TableRow
                key={profile.id}
                className="cursor-pointer bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                onClick={() => handleClick(profile)}
            >
                <TableCell>{profile.id}</TableCell>

                {/* Fotoğrafı URL string yerine görsel olarak gösterelim */}
                <TableCell>
                    <Avatar img={profile.photo} rounded size="sm" />
                </TableCell>

                <TableCell className="font-medium text-gray-900 dark:text-white">
                    {profile.username}
                </TableCell>
                <TableCell>{profile.email}</TableCell>
                <TableCell>{profile.profileType?.name}</TableCell>

                {/* Tag Düzeltmesi */}
                <TableCell>
                    <div className="flex flex-wrap gap-2">
                        {/* Eğer tags boşsa hata vermesin diye ?. ve map kullanıyoruz */}
                        {/* Tag yapın { id: number, name: string } şeklindeyse 'tag.name' kullan */}
                        {profile.tags && profile.tags.length > 0 ? (
                            profile.tags.map((tag: any, index: number) => (
                                <Badge key={index} color="info">
                                    {tag.name} {/* Backenddeki tag isimlendirmesine göre burayı değiştir (örn: tag.tagName) */}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-gray-400">-</span>
                        )}
                    </div>
                </TableCell>

                <TableCell>
                    <div className="flex gap-2">
                        {/* ProfileFormModal tıklandığında satır tıklamasını engellemek gerekebilir */}
                        <div onClick={(e) => e.stopPropagation()}>
                            <ProfileFormModal fetchProfiles={fetchProfiles} profile={profile} />
                        </div>

                        <Button
                            size="xs"
                            color="red"
                            onClick={(e) => {
                                e.stopPropagation(); // ÖNEMLİ: Satıra tıklamayı engeller
                                setShowDelete(true);
                            }}
                        >
                            <FaTrash />
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
        </>
    );
};

export default ProfileRow;