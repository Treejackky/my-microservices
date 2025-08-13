import styles from './page.module.scss';

type User = { id: number; name: string };

async function fetchUsers(): Promise<User[]> {
  const baseUrl = process.env.API_USERS_URL || 'http://localhost:3001';
  const res = await fetch(`${baseUrl}/api/users`, { cache: 'no-store' });
  return res.json();
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
