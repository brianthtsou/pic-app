import { FC } from "react";

interface SignedURLImageProps {
  imageUrl: string;
}

const SignedURLImage: FC<SignedURLImageProps> = ({ imageUrl }) => {
  return (
    <div>
      <img src={imageUrl} />
    </div>
  );
};

export default SignedURLImage;
