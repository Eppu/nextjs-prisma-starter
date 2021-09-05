import React from "react";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from '../components/Post';
import { useSession, getSession } from "next-auth/client";
import prisma from "../lib/prisma";

// Use SSR for getting posts from authenticated users
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getSession({ req });

    if (!session) {
        res.statusCode = 403;
        return { props: { drafts: [] } };
    }

    const drafts = await prisma.post.findMany({
        where: {
            author: { email: session.user.email },
            published: false
        },
        include: {
            author: {
                select: { name: true },
            }
        }
    });
    return {
        props: { drafts }
    }
};

type Props = {
    drafts: PostProps[];
};

const Drafts: React.FC<Props> = (props) => {
    const [session] = useSession();

    if (!session) {
        return (
            <Layout>
                <h1>My drafts</h1>
                <div>You need to log in to view this page.</div>
            </Layout>
        );
    }

    const hasPosts: Boolean = props.drafts.length > 0;

    return (
        <Layout>
            <div className="page">
                <h1>My drafts</h1>
                <main>
                    {hasPosts ? props.drafts.map((post) => (
                        <div key={post.id} className="post">
                            <Post post={post} />
                        </div>
                    )) : <p>You don&apos;t currently have any drafts.</p>}
                    
                </main>
            </div>
            <style jsx>{`
        .post {
          background: #FFF;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
        </Layout>
    )
}

export default Drafts;