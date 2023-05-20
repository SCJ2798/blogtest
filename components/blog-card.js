

import Link from "next/link";

export default function BlogCard({title,author,content,date,href,key}) {
    return (
        <Link href={href} key={key} >
        <div className="blog-card">
        {date && <div className="date-text"> <label> {date}</label></div>}
        <div className="title"> <label> {title}</label></div>
        { author && <div children="sub-title"> <label> By {author}</label></div>}
        <div className="content"> <label > {content}</label></div>
        </div>
        </Link>
    );
}