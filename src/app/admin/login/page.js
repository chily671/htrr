// 'use client'

// import { useState } from 'react'

// export default function LoginPage() {
//   const [username, setUsername] = useState('')
//   const [password, setPassword] = useState('')

//   // const handleLogin = (e) => {
//   //   e.preventDefault()
//   //   if (username === 'admin' && password === '123456') {
//   //     localStorage.setItem('isAdmin', 'true')
//   //     window.location.href = '/admin/station'
//   //   } else {
//   //     alert('Sai tài khoản hoặc mật khẩu')
//   //   }
//   // }

//   return (
//     <div className="p-8 max-w-md mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Đăng nhập Admin</h1>
//       <form onSubmit={handleLogin} className="flex flex-col gap-4">
//         <input
//           type="text"
//           placeholder="Tên đăng nhập"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="border p-2 rounded"
//         />
//         <input
//           type="password"
//           placeholder="Mật khẩu"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="border p-2 rounded"
//         />
//         <button type="submit" className="bg-blue-500 text-white py-2 rounded">
//           Đăng nhập
//         </button>
//       </form>
//     </div>
//   )
// }
