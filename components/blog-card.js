

import Link from "next/link";

export default function BlogCard({title,author,content,date,href,key}) {

    const dateView = <div className="date-text"> <label> {date}</label></div>;
    const authorView = <div> <label> By {author}</label> </div>;

    return (
        <Link href={href} key={key} >
            <div className="blog-card">
                {/* [{ date && <div className="date-text"> <label> {date}</label></div>}] */}
                {date && dateView}
                <div className="title"> <label> {title}</label></div>
                {date && authorView}
                <div className="content"> <label > {content}</label></div>
            </div>
        </Link>
    );
}