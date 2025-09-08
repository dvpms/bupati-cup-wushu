import { EVENT } from "@/config/event";
import { FiAward } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700">
      <div className="container mx-auto py-12 px-6 md:px-8 lg:max-w-[960px] xl:max-w-[1100px] 2xl:max-w-[1240px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mr-5">
              <Image
                src={EVENT.assets.logos.kabupaten}
                alt="Logo Kabupaten"
                width={105}
                height={105}
              />
              <Image
                src={EVENT.assets.logos.pusat}
                alt="Logo Cabang"
                width={105}
                height={105}
              />
              <Image
                src={EVENT.assets.logos.cabang}
                alt="Logo Cabang"
                width={105}
                height={105}
              />
            </div>
            <p className="text-gray-600 mt-2 max-w-xs">
              Portal pendaftaran resmi untuk {EVENT.name}.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg text-gray-900">IKUTI KAMI</h4>
            <div className="flex justify-center md:justify-start space-x-4 mt-4">
              <a
                href={EVENT.links.social.facebook}
                target="_blank"
                rel="noreferrer noopener"
                className="text-gray-500 hover:text-purple-600 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-6 h-6" />
              </a>
              <a
                href={EVENT.links.social.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="text-gray-500 hover:text-purple-600 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-6 h-6" />
              </a>
              <a
                href={EVENT.links.social.x}
                target="_blank"
                rel="noreferrer noopener"
                className="text-gray-500 hover:text-purple-600 transition-colors"
                aria-label="X"
              >
                <FaXTwitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg text-gray-900">HUBUNGI KAMI</h4>
            {/* <p className="text-gray-600 mt-2">Email: <a href={EVENT.links.mailto} className="text-purple-700 hover:text-purple-800 underline-offset-2 hover:underline">{EVENT.contacts.email}</a></p> */}
            <p className="text-gray-600">
              <span className="text-black me-2">{EVENT.contacts.whatsapp.name}</span>
              <a
                href={EVENT.links.wa}
                target="_blank"
                rel="noreferrer noopener"
                className="text-purple-700 hover:text-purple-800 underline-offset-2 hover:underline"
              >
                {EVENT.contacts.whatsapp.number}
              </a>
            </p>
          </div>
        </div>
        <div className="border-t border-neutral-200 mt-8 pt-6 text-center text-neutral-500 text-sm">
          &copy; {new Date().getFullYear()} {EVENT.brand}. All Rights Reserved.
        </div>
        <div className="text-center text-xs text-gray-400 mt-2">
          Developed by
          <span className="font-semibold text-purple-700">Devran P.M</span>
        </div>
      </div>
    </footer>
  );
}
