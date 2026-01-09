import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import type { Profile } from "../types/Profile";
import { ProfileRow } from "./ProfileRow";
import { useEffect, useState } from "react";
import { ProfileFormModal } from "./ProfileFormModal";
import { api } from "../helper/api";

const ProfileTable = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  function fetchProfiles() {
    api.get("profiles").then((res) => setProfiles(res.data));
  }

  useEffect(() => {
    fetchProfiles();
  }, []);

  function handleClick(profile: Profile) {
    console.log(profile);
  }

  return (
    <>
      <ProfileFormModal fetchProfiles={fetchProfiles} profile={null} />
      <div className="bg-white rounded-lg shadow-md p-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Id</TableHeadCell>
              <TableHeadCell>Fotoğraf</TableHeadCell>
              <TableHeadCell>Kullanıcı Adı</TableHeadCell>
              <TableHeadCell>Email</TableHeadCell>
                          <TableHeadCell>Profil Tipi</TableHeadCell>
                          <TableHeadCell>Tagler</TableHeadCell>
                          <TableHeadCell>İşlemler</TableHeadCell>
                          
            </TableRow>
          </TableHead>
          <TableBody>
            {profiles.map((p) => (
              <ProfileRow
                key={p.id}
                fetchProfiles={fetchProfiles}
                profile={p}
                handleClick={handleClick}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default ProfileTable;