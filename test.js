// test.js
async function runTest() {
  console.log('1. ユーザー登録を実行します...');
  const regRes = await fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'intern@example.com',
      password: 'password123',
      name: 'Test Intern'
    })
  });
  console.log('登録結果:', await regRes.json());

  console.log('\n2. 続けてログインを実行します...');
  const loginRes = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'intern@example.com',
      password: 'password123'
    })
  });
  console.log('ログイン結果:', await loginRes.json());
}

runTest();