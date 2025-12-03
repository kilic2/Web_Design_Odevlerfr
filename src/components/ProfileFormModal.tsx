import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Select,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { showErrors } from "../helper/helper";
import type { Profile, ProfileType } from "../types/Profile";
import { FaEdit, FaPlus } from "react-icons/fa";
import { api } from "../helper/api";
import { toast } from "sonner";

interface Props {
  fetchProfiles: () => void;
  profile: Profile | null;
}

export const ProfileFormModal = ({ fetchProfiles, profile }: Props) => {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rpPassword, setRpPassword] = useState("");
  const [profileTypeId, setProfileTypeId] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [types, setTypes] = useState<ProfileType[]>([]);

  useEffect(() => {
    if (show) {
      api.get("profileTypes")
        .then((res) => {
          setTypes(res.data);
          if (!profile && res.data.length > 0 && profileTypeId === "") {
            setProfileTypeId(res.data[0].id.toString());
          }
        })
        .catch(() => toast.error("Tipler yüklenemedi"));
    }
  }, [show]);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setEmail(profile.email);
      setProfileTypeId(profile.profileTypeId ? profile.profileTypeId.toString() : "");
      setPassword("");
      setRpPassword("");
      setPhoto(null);
      setPhotoPreview(profile.photo || "");
    } else {
      setUsername("");
      setEmail("");
      setPassword("");
      setRpPassword("");
      setProfileTypeId("");
      setPhoto(null);
      setPhotoPreview("");
    }
  }, [profile, show]);

  function handleSave() {
    console.log("handleSave called", { username, email, password, profileTypeId });
    
    if (!username || !email) {
      toast.error("Kullanıcı adı ve email gerekli");
      return;
    }
    
    if (!profileTypeId) {
      toast.error("Profil tipi seçiniz");
      return;
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    
    if (!profile) {
      if (!password || !rpPassword) {
        toast.error("Şifre gerekli");
        return;
      }
      if (password !== rpPassword) {
        toast.error("Şifreler eşleşmiyor");
        return;
      }
      if (!passwordRegex.test(password)) {
        toast.error("Şifre en az 8 karakter olmalı ve en az 1 büyük harf, 1 küçük harf, 1 sayı ve 1 sembol içermelidir.");
        return;
      }
    } else {
      if (password.trim() !== "" || rpPassword.trim() !== "") {
        if (password !== rpPassword) {
          toast.error("Şifreler eşleşmiyor");
          return;
        }
        if (!passwordRegex.test(password)) {
          toast.error("Şifre en az 8 karakter olmalı ve en az 1 büyük harf, 1 küçük harf, 1 sayı ve 1 sembol içermelidir.");
          return;
        }
      }
    }
    
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("profileTypeId", profileTypeId);
    
    if (photo) {
      formData.append("photo", photo);
    }

    if (profile) {
      if (password.trim() !== "" && rpPassword.trim() !== "") {
        formData.append("password", password);
        formData.append("rpPassword", rpPassword);
      } else {
        formData.append("password", "");
        formData.append("rpPassword", "");
      }
    } else {
      formData.append("password", password);
      formData.append("rpPassword", rpPassword);
    }

    console.log("Sending to API");
    console.log("FormData contents:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    
    if (profile) {
      api.patch("profiles/" + profile.id, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then((response) => { 
          console.log("Update response:", response);
          fetchProfiles(); 
          toast.success("Güncellendi"); 
          setShow(false); 
        })
        .catch((err) => { 
          console.error("Update error:", err);
          console.error("Error response:", err.response);
          showErrors(err); 
        });
    } else {
      api.post("profiles", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(() => { 
          fetchProfiles(); 
          toast.success("Eklendi"); 
          setShow(false); 
        })
        .catch((err) => { 
          console.error("Create error:", err); 
          showErrors(err); 
        });
    }
  }

  return (
    <>
      <div className="flex">
        {profile ? (
          <Button size="xs" color="green" onClick={() => setShow(true)}><FaEdit /></Button>
        ) : (
          <Button color="dark" className="ml-auto mb-2" onClick={() => setShow(true)}><FaPlus className="mr-2"/> Yeni Ekle</Button>
        )}
      </div>
      <Modal show={show} size="md" onClose={() => setShow(false)} popup>
        <ModalHeader>
          {profile ? "Düzenle" : "Yeni Ekle"}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="u">Kullanıcı Adı</Label>
              </div>
              <TextInput id="u" value={username} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="e">Email</Label>
              </div>
              <TextInput id="e" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="photo">Fotoğraf</Label>
              </div>
              <TextInput 
                id="photo" 
                type="file" 
                accept="image/*" 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPhoto(file);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setPhotoPreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }} 
              />
              {photoPreview && (
                <div className="mt-2">
                  <img src={photoPreview} alt="Preview" className="h-24 w-24 rounded object-cover" />
                </div>
              )}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="p">Şifre {profile && <span className="text-gray-500 text-sm">(Değiştirmek için doldur)</span>}</Label>
              </div>
              <TextInput id="p" type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="rp">Şifre Tekrar {profile && <span className="text-gray-500 text-sm">(Değiştirmek için doldur)</span>}</Label>
              </div>
              <TextInput id="rp" type="password" value={rpPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRpPassword(e.target.value)} />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="t">Tip</Label>
              </div>
              <Select id="t" value={profileTypeId} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setProfileTypeId(e.target.value)}>
                <option value="" disabled>Seçiniz</option>
                {types.map((t) => <option key={t.id} value={t.id.toString()}>{t.name}</option>)}
              </Select>
            </div>
            <div className="w-full">
              <Button onClick={handleSave}>Kaydet</Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};