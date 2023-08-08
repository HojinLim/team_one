import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import Comments from '../components/comments/Comments';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL as string;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY as string;

const supabase = createClient(supabaseUrl, supabaseKey);

interface Post {
  pid: number;
  title: string;
  body: string;
}

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    async function fetchPost() {
      const { data: posts, error } = await supabase.from('posts').select('*').eq('pid', id).single();
      console.log('계속도나?');
      if (error) {
        console.error('Error fetching post:', error);
      } else {
        setPost(posts);
      }
    }

    fetchPost();
  }, [id]);

  const handleEdit = () => {};

  const handleDelete = async () => {
    const { error } = await supabase.from('posts').delete().eq('pid', post?.pid);

    if (error) {
      console.error('Error deleting post:', error);
    } else {
      alert('삭제 완료!');
      navigate(`/`);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <h1>Post Detail</h1>
        <p>ID: {post.pid}</p>
        <h2>{post.title}</h2>
        <div dangerouslySetInnerHTML={{ __html: post.body }} />
        <button onClick={handleEdit}>수정하기</button>
        <button onClick={handleDelete}>삭제하기</button>
      </div>
      <Comments></Comments>
    </>
  );
};

export default Detail;