import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="text-primary size-6">
              <svg
                fill="currentColor"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" />
              </svg>
            </div>
            <span className="text-lg font-bold">Nearly</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            The marketplace for extraordinary craft and human connection.
          </p>
        </div>

        <div>
          <h5 className="font-bold text-sm mb-4">Marketplace</h5>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                All Services
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                How it works
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Safety
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-sm mb-4">Experts</h5>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Become a Hero
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Professional Tools
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Guidelines
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-sm mb-4">Support</h5>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Privacy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-20 mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground">
          © 2024 Nearly Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
