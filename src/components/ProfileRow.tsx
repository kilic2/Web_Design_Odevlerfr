import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  TableCell,
  TableRow,
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

      <TableRow key={profile.id} onClick={() => handleClick(profile)}>
        <TableCell>{profile.id}</TableCell>
        <TableCell>
          {profile.photo } </TableCell>
        <TableCell>{profile.username}</TableCell>
        <TableCell>{profile.email}</TableCell>
        <TableCell>{profile.profileType?.name}</TableCell>
        <TableCell>
          <div className="flex">
            <ProfileFormModal fetchProfiles={fetchProfiles} profile={profile} />
            <Button
              className="ml-2"
              size="xs"
              color="red"
              onClick={() => setShowDelete(true)}
            >
              <FaTrash />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};export default ProfileRow;