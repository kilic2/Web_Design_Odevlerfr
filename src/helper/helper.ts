import { toast } from "sonner";

export function isDigit(str: string) {
  // Yalnızca rakamlardan oluşan stringleri kontrol eder
  const rakamRegex = /^[0-9]*$/;
  return rakamRegex.test(str);
}

export function showErrors(error: any) {
  try {
    const message = error.response?.data?.message;
    
    if (Array.isArray(message)) {
      message.forEach((m: string) => {
        toast.error(m);
      });
    } else if (typeof message === 'string') {
      toast.error(message);
    } else if (error.response?.data?.error) {
      toast.error(error.response.data.error);
    } else if (error.message) {
      toast.error(error.message);
    } else {
      toast.error("Bir hata oluştu");
    }
  } catch (e) {
    toast.error("Bir hata oluştu");
  }
}
