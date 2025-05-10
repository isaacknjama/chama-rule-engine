interface Chama {
    id: string;
    name: string;
    members: Member[];
    createdAt: Date;
    updatedAt: Date;
    description?: string;
    walletId: string;
}

interface Member {
    id: string;
    name: string;
    phone?: string;
    npub?: string;
    role?: MemberRole;
    joinedAt: Date;
    verified: boolean;
}

enum MemberRole {
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER'
}


export { Chama, Member, MemberRole };