import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { LoginRequest, FirebaseLogin, TokenReponse } from "../../models";
import { Mail, Lock, AlertCircle, CheckCircle, Loader2, UserCircle } from "lucide-react";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "../../services/firebaseService";
import { useLoginWithEmail, useLoginWithGoogle } from "../../hooks/useLogin";

export function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginRequest>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const { mutate: loginWithGoogle } = useLoginWithGoogle();
  const { mutate: loginWithEmail } = useLoginWithEmail();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let user;
      try {
        const userCred = await signInWithEmailAndPassword(auth, form.email, form.password);
        user = userCred.user;
      } catch (authErr: any) {
        console.error("Auth error:", authErr);
        switch (authErr.code) {
          case "auth/user-not-found":
            setError("Usuario no encontrado.");
            break;
          case "auth/wrong-password":
            setError("Contraseña incorrecta.");
            break;
          case "auth/invalid-email":
            setError("Correo inválido.");
            break;
          case "auth/invalid-credential":
            setError("Credenciales no válidas.");
            break;
          default:
            setError("Error de autenticación: " + (authErr.message || authErr));
        }
        return;
      }

      if (!user.emailVerified) {
        setError("Debes verificar tu correo antes de ingresar.");
        return;
      }

      let token;
      try {
        token = await user.getIdToken();
      } catch (tokenErr: any) {
        console.error("Token error:", tokenErr);
        setError("No se pudo obtener el token de autenticación.");
        return;
      }

      try {
        const req: FirebaseLogin = { token };
        const tokenRes = (await loginWithEmail(req)) as TokenReponse;
        localStorage.setItem("token", tokenRes.token);
        navigate("/");
      } catch (backendErr: any) {
        console.error("Backend login error:", backendErr);
        setError("Error en login del backend.");
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      try {
        await sendEmailVerification(user);
        setSuccess("Registro exitoso. Revisa tu correo para verificar tu cuenta.");
      } catch (emailErr: any) {
        setError("Usuario registrado, pero no se pudo enviar el correo de verificación.");
        console.error("Error enviando correo de verificación:", emailErr);
      }
    } catch (regErr: any) {
      console.error("Error registrando usuario:", regErr);

      switch (regErr.code) {
        case "auth/weak-password":
          setError("La contraseña debe tener al menos 6 caracteres.");
          break;
        case "auth/email-already-in-use":
          setError("Este correo ya está registrado.");
          break;
        case "auth/invalid-email":
          setError("Correo inválido.");
          break;
        default:
          setError(regErr.message || "Error al registrar usuario");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();
      const req: FirebaseLogin = { token };

      const tokenRes = (await loginWithGoogle(req)) as TokenReponse;
      localStorage.setItem("token", tokenRes.token);

      navigate("/");
    } catch (err: any) {
      console.error(err);
      setError("No se pudo iniciar sesión con Google");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = () => {
    navigate("/");
  };

  const handleForgotPassword = async () => {
    if (!form.email) {
      setError("Ingresa tu correo para restablecer la contraseña.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, form.email);
      setSuccess("Si el correo está registrado, se ha enviado un enlace para restablecer tu contraseña.");
    } catch (err: any) {
      console.error("Error al restablecer contraseña:", err);

      switch (err.code) {
        case "auth/invalid-email":
          setError("El formato del correo es inválido.");
          break;
        default:
          // Este mensaje no revela si el correo existe o no (buena práctica de seguridad)
          setError("Si el correo está registrado, se enviará un enlace de recuperación.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {isRegister ? "Crear cuenta en Farma Santi" : "Bienvenido a Farma Santi"}
            </h2>
            <p className="text-gray-600 text-sm">
              {isRegister ? "Regístrate para comenzar" : "Inicia sesión en tu cuenta"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4 flex items-start gap-2">
              <AlertCircle className="flex-shrink-0 mt-0.5 w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4 flex items-start gap-2">
              <CheckCircle className="flex-shrink-0 mt-0.5 w-4 h-4" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="tu@email.com"
                  className="w-full rounded-lg border border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-sm px-4 py-2.5 pl-11 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-sm px-4 py-2.5 pl-11 transition"
                />
              </div>
              {!isRegister && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="mt-1.5 text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium transition"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin w-5 h-5" />
                  {isRegister ? "Creando cuenta..." : "Ingresando..."}
                </span>
              ) : (
                isRegister ? "Registrarse" : "Ingresar"
              )}
            </button>
          </form>

          {/* Divisor */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="px-4 text-sm text-gray-500 font-medium">o continúa con</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          {/* Botones alternativos */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg py-2.5 font-semibold text-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuar con Google
            </button>

            <button
              onClick={handleGuestAccess}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-2.5 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
            >
              <UserCircle className="w-5 h-5" />
              Continuar como invitado
            </button>
          </div>

          {/* Toggle registro/login */}
          <p className="mt-6 text-center text-sm text-gray-600">
            {isRegister ? (
              <>
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => { setIsRegister(false); setError(""); setSuccess(""); }}
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition"
                >
                  Inicia sesión
                </button>
              </>
            ) : (
              <>
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => { setIsRegister(true); setError(""); setSuccess(""); }}
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition"
                >
                  Regístrate gratis
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
