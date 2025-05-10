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
    role?: MemberRole;
    joinedAt: Date;
    active: boolean;
    contactInfo: ContactInfo;
}

enum MemberRole {
    ADMIN = 'ADMIN',
    TREASURER = 'TREASURER',
    SECRETARY = 'SECRETARY',
    MEMBER = 'MEMBER'
}

interface ContactInfo {
    email: string;
    phone?: string;
}

export { Chama, Member, MemberRole, ContactInfo };