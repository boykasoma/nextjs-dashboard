import styles from "@/app/ui/home.module.css";
// Update the path below to the actual location of the status component, for example:
import { lusitana } from "@/app/ui/fonts";
import InvoiceStatus from "@/app/ui/invoices/status";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className={styles.shape}></div>
      <p
        className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}
      >
        <strong>Welcome to Acme.</strong> This is the example for the{" "}
        <a href="https://nextjs.org/learn/" className="text-blue-500">
          Next.js Learn Course
        </a>
        , brought to you by Vercel.
      </p>

      <div className="container mx-auto p-4 relative">
        <div className="bg-white border-2 border-purple-100 rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl text-purple-700 font-bold mb-4">Welcome</h1>
            <p className="text-lg text-gray-700 mb-4">
              Massa urna magnis dignissim id euismod porttitor vitae etiam
              viverra nunc at adipiscing sit morbi aliquet mauris porttitor
              nisi, senectus pharetra, ac porttitor orci.
            </p>

            <h1 className="text-blue-500">I'm blue!</h1>
            <p className="text-blue-500">
              This is a blue text example to show how to use Tailwind CSS
              classes.
            </p>
            <a
              href="/blog/about"
              className="outline outline-1 outline-offset-2 border-purple-700 text-purple-700 hover:text-white py-2 px-4 rounded hover:bg-purple-800 md:w-auto"
            >
              Go to Blog about
            </a>

            <br />

            <a
              href="/blog/contact"
              className="outline outline-1 outline-offset-2 border-purple-700 text-purple-700 hover:text-white py-2 px-4 rounded hover:bg-purple-800 md:w-auto"
            >
              Go to Blog contact
            </a>

            <InvoiceStatus status="pending" />
            <InvoiceStatus status="paid" />
          </div>
        </div>
      </div>
      <div className="bg-purple-800 hidden md:block absolute top-0 right-0 bottom-0 left-2/3 z-0"></div>
    </main>
  );
}
