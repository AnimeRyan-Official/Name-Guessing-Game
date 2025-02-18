import { Button } from "@/components/ui/button";
import { 
  Twitter, 
  Facebook, 
  Linkedin, 
  Share2,
  Check
} from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  text: string;
  url?: string;
}

export function ShareButtons({ title, text, url = window.location.href }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  
  const shareText = `${title}\n${text}`;
  
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(url);

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(text)}`
  };

  const handleShare = async (platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => handleShare('twitter')}
      >
        <Twitter className="h-4 w-4" />
        Tweet
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => handleShare('facebook')}
      >
        <Facebook className="h-4 w-4" />
        Share
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => handleShare('linkedin')}
      >
        <Linkedin className="h-4 w-4" />
        Post
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={copyToClipboard}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Share2 className="h-4 w-4" />
        )}
        {copied ? 'Copied!' : 'Copy Link'}
      </Button>
    </div>
  );
}
