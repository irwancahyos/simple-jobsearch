// ********** Import **********
import toast from 'react-hot-toast';
import { Pencil } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

import { useUserStore } from '@/app/store/userStore';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabaseClient';

// ********** Main Component **********
const Profile = () => {
  const inputProfileRef = useRef<HTMLInputElement>(null);
  const inputBackgroundProfileRef = useRef<HTMLInputElement>(null);
  const [isLoadingState, setIsLoadingState] = useState({
    image: false,
    cover_image: false,
  });
  const [publicUrl, setPublicUrl] = useState('');
  const [coverImagepublicUrl, setCoverImagePublicUrl] = useState('');
  const profile = useUserStore((state) => state.profile);

  const setSingleLoading = (key: 'image' | 'cover_image', state: boolean) => {
    setIsLoadingState((prev) => ({
      ...prev,
      [key]: state,
    }));
  };

  const setAllLoading = (state: boolean) => setIsLoadingState({ cover_image: state, image: state });

  const getFileName = async () => {
    const { data } = await supabase.from('profiles').select('image, cover_image').eq('id', profile?.id).single();
    return { image: data?.image, coverImage: data?.cover_image };
  };

  const getImageProfile = async () => {
    try {
      setAllLoading(true);
      const { image, coverImage } = await getFileName();

      if (image || coverImage) {
        const { data: dataImage } = supabase.storage.from('images').getPublicUrl(image);

        if (coverImage) {
          const { data: dataCoverImage } = supabase.storage.from('images').getPublicUrl(coverImage);

          if (dataCoverImage?.publicUrl) {
            setCoverImagePublicUrl(dataCoverImage?.publicUrl);
          }
        }

        if (dataImage?.publicUrl) {
          setPublicUrl(dataImage?.publicUrl);
        }
      }
    } catch (e) {
      toast.error('Error when getting image');
    } finally {
      setAllLoading(false);
    }
  };

  const uploadImage = async (file: File, column: 'image' | 'cover_image') => {
    setSingleLoading(column, true);
    const isColumnImage = column === 'image';
    const localFileName = `${file?.name}-${uuidv4()}`;
    const { coverImage, image } = await getFileName();
    const oldFileName = isColumnImage ? image : coverImage;

    try {
      // delete old file from storage
      if (oldFileName) {
        const { error } = await supabase.storage.from('images').remove([oldFileName]);

        if (error) {
          throw new Error('Error when delete old file!');
        }
      }

      // upload new file
      const { data, error } = await supabase.storage.from('images').upload(localFileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

      if (error) {
        throw new Error('Error upload image');
      }

      if (data) {
        const { data: dataUpdateImage, error: errorUpdateImage } = await supabase
          .from('profiles')
          .update({ [column]: data?.path })
          .eq('id', profile?.id)
          .select();

        if (errorUpdateImage) {
          throw new Error('Error when save image to database');
        }

        if (dataUpdateImage) {
          // Get public URL
          const { data } = supabase.storage.from('images').getPublicUrl(dataUpdateImage?.[0]?.[column]);

          if (data?.publicUrl) {
            // setState
            isColumnImage ? setPublicUrl(data.publicUrl) : setCoverImagePublicUrl(data.publicUrl);

            toast.success('Success upload and save image!');
          }
        }
      }
    } catch (e) {
      toast.error('Error when upload image!');
    } finally {
      setSingleLoading(column, false);
    }
  };

  useEffect(() => {
    getImageProfile();
  }, []);

  const handleInputClicked = (event: React.ChangeEvent<HTMLInputElement>, column: 'image' | "cover_image") => {
    const originalFile = event?.target?.files?.[0];

    if(originalFile) {
      uploadImage(originalFile, column);
    }
  }

  const LoadingComponent = ({ size = 'w-12 h-12' }: { size?: string }) => (
    <div
      className={`${size} rounded-full animate-spin
                     border border-solid border-(--secondary-color) border-t-transparent`}
    />
  );

  return (
    <div className="min-h-56 h-full">
      <DialogHeader>
        <DialogTitle className="sr-only">Pfofile Dialog</DialogTitle>
      </DialogHeader>
      <div className="relative">
        {/* Image Profile */}
        <div
          style={{ backgroundImage: coverImagepublicUrl && !isLoadingState?.cover_image ? `url(${coverImagepublicUrl})` : '' }}
          className="bg-cover bg-no-repeat p-[24px] h-full min-h-24 bg-center"
        >
          <button
            onClick={() => inputBackgroundProfileRef?.current?.click()}
            className="p-1 rounded-full bg-white/50 absolute top-3 right-3 flex justify-center items-center cursor-pointer hover:bg-white/30 duration-300"
          >
            {isLoadingState?.cover_image ? <LoadingComponent size="w-4 h-4" /> : <Pencil size={10} />}
          </button>
          <button
            onClick={() => inputProfileRef?.current?.click?.()}
            className={`absolute p-0 w-20 h-20 top-14 -translate-x-1/2 left-1/2 flex justify-center items-center rounded-full cursor-pointer overflow-hidden border bg-white`}
          >
            {isLoadingState?.image ? (
              <LoadingComponent />
            ) : (
              <Image src={publicUrl || 'https://picsum.photos/200?random=1'} height={200} width={200} alt="Profile picture image" />
            )}
          </button>
        </div>

        <input
          type="file"
          className="sr-only"
          ref={inputBackgroundProfileRef}
          onChange={(event) => handleInputClicked(event, 'cover_image')}
          accept="image/jpg,.png"
        />

        <input
          type="file"
          className="sr-only"
          ref={inputProfileRef}
          onChange={(event) => handleInputClicked(event, 'image')}
          accept="image/jpg,.png"
        />

        {/* content */}
        <div className="pt-12 px-[24px] pb-[24px]">
          <ul className="space-y-2 text-[14px]">
            <li className="p-2 rounded-md shadow">{profile?.email?.split('@')[0]}</li>
            <li className="p-2 rounded-md shadow">{profile?.email}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
