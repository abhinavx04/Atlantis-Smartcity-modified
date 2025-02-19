declare module 'emailjs-com' {
  export function send(
    serviceId: string,
    templateId: string,
    templateParams: { [key: string]: any },
    publicKey: string
  ): Promise<void>;
}
