"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import Image from "next/image";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [teamCode, setTeamCode] = useState("");
  const [password, setPassword] = useState("");
  const [teamName, setTeamName] = useState("");

  const router = useRouter();
  const { login, isLogin, logout, register, loading, user } = useAuth();

  const handleOpen = (mode) => {
    setMode(mode);
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "login") {
      const result = await login(teamCode, password);
      if (result.success) {
        toast.success("Đăng nhập thành công!");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || "Đăng nhập thất bại");
      }
    } else {
      const result = await register({
        teamName,
        teamCode,
        password,
      });
      if (result.success) {
        toast.success("Đăng ký thành công!");
        setOpen(false);
      } else {
        toast.error(result.error || "Đăng ký thất bại");
      }
    }
  };

  return (
    <nav className="w-full flex justify-between items-center py-4 px-6 bg-white shadow-md mb-10">
      <div className="text-xl font-bold">
        <Image
          src="/name.png"
          alt="Logo"
          width={200}
          height={500}
          className="inline-block mr-2"
        />
      </div>
      {loading ? (
        <p className="text-sm text-gray-500">Đang kiểm tra đăng nhập...</p>
      ) : !isLogin ? (
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => handleOpen("login")}>
            Đăng nhập
          </Button>
          {/* <Button onClick={() => handleOpen('register')}>Đăng ký</Button> */}

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogTitle className="text-xl font-bold text-center">
                {mode === "login" ? "Đăng nhập đội chơi" : "Đăng ký đội chơi"}
              </DialogTitle>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col space-y-3 mt-4"
              >
                {mode === "register" && (
                  <input
                    type="text"
                    placeholder="Tên đội"
                    className="border p-2 rounded"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                  />
                )}
                <input
                  type="text"
                  placeholder="Mã đội (team code)"
                  className="border p-2 rounded"
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  className="border p-2 rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button className="w-full">
                  {mode === "login" ? "Đăng nhập" : "Đăng ký"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <span className="text-base text-gray-600">
            Xin chào, <strong>Đội {user?.teamName || user?.teamId}</strong>
          </span>
          <Button
            variant="destructive"
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            Đăng xuất
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
