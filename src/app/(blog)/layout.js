import '../globals.css';

export default function BlogLayout({ children }) {
    return (
        <div className="blog-layout">
            <main className="blog-main">
                {children}
            </main>
        </div>
    );
}
