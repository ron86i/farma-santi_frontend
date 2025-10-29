import type { FirebaseLogin } from "../models"
import { loginWithEmail, loginWithGoogle } from "../services/loginService"
import { useMutation } from "./generic"

export function useLoginWithGoogle() {
  return useMutation((credential: FirebaseLogin) => {
    return loginWithGoogle(credential)
  })
}

export function useLoginWithEmail() {
  return useMutation((credential: FirebaseLogin) => {
    return loginWithEmail(credential)
  })
}
