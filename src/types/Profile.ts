export type Profile = {
  id: number;
  password: string;
  username: string;
  photo: string;
  email: string; 
  profileTypeId: number;
  profileType?: ProfileType;
};

export type ProfileType = {
  id: number;
  name: string;
};
