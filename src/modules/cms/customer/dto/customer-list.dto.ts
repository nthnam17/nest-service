import { formatDateTime } from '../../../../utils/datetime.util';

export class CustomerListDto {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    status: string;
    created_at: string;
    updated_at: string;

    constructor(value: any) {
        this.id = value.id;
        this.name = value.name;
        this.email = value.email;
        this.phone = value.phone;
        this.address = value.address;
        this.status = value.status;
        this.created_at = value.created_at ? formatDateTime(value.created_at) : '';
        this.updated_at = value.updated_at ? formatDateTime(value.updated_at) : '';
    }
}
