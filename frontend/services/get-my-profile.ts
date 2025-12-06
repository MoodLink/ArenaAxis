import { UserResponse } from "@/types";

export function getMyProfile() : UserResponse | null {
	const user = localStorage.getItem('user');
	return user ? JSON.parse(user) as UserResponse : null;
}