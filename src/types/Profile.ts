export type ProfileType = {
    id: number;
    name: string;
};

export type Tag = {
    id: number;
    name: string;
};

export type Profile = {
    id: number;
    password: string;
    username: string;
    photo: string;
    email: string;
    profileTypeId: number;
    profileType?: ProfileType;
    tags?: Tag[];
};

export type Comment = {
    id: number;
    userId: number;
    content: string;
    date: Date;
    user?: {
        username: string;
        tags?: Tag[];
    };
};

export type Review = {
    id: number;
    title: string;
    desc: string;
    img: string;
    date: Date;
    comments?: Comment[];
};