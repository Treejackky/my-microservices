import styles from './page.module.scss';

type User = { id: number; name: string };

async function fetchUsers(): Promise<User[]> {
  const baseUrl =
    process.env.API_BASE_URL ||
    process.env.API_USERS_URL ||
    'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/users`, { cache: 'no-store' });
    if (!res.ok) {
      console.error('Failed to fetch users', res.statusText);
      return [];
    }
    return res.json();
  } catch (err) {
    console.error('Failed to fetch users', err);
    return [];
  }
}

export default async function Index() {
  const users = await fetchUsers();

  return (
    <div className={styles.page}>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
