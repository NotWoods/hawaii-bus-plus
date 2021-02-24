import { User } from '@hawaii-bus-plus/gotrue';

export async function formatUser(user: User) {
  const userData = await user.getUserData();
  return {
    confirmed_at: userData.confirmed_at,
    created_at: userData.created_at,
    email: userData.email,
    role: userData.role,
    updated_at: userData.updated_at,
    app_metadata: userData.app_metadata,
    user_metadata: userData.user_metadata,
  };
}
