interface FooterProps {
  text?: string;
}

export default function Footer({ text }: FooterProps) {
  return (
    <footer className="py-8 border-t border-gray-300/50 dark:border-gray-800/50">
      <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
        <p>{text ?? "© 2025 Jordan Lang. Built with Next.js, Tailwind CSS, and Framer Motion"}</p>
      </div>
    </footer>
  );
}
