import React from "react";
import type {
  PublicProfileBlock,
  ProfileBlock,
  LinkBlockConfig,
  HeadingBlockConfig,
  TextBlockConfig,
  DividerBlockConfig,
  SocialBlockConfig,
  ImageBlockConfig,
  VideoBlockConfig,
  MusicBlockConfig,
  MapBlockConfig,
  ContactBlockConfig,
  EmailBlockConfig,
  PhoneBlockConfig,
  WhatsAppBlockConfig,
  BookingBlockConfig,
  FaqBlockConfig,
  GalleryBlockConfig,
  CountdownBlockConfig,
  CtaBlockConfig,
} from "@/types/blocks";
import { LinkBlock } from "./LinkBlock";
import { HeadingBlock } from "./HeadingBlock";
import { TextBlock } from "./TextBlock";
import { DividerBlock } from "./DividerBlock";
import { SocialBlock } from "./SocialBlock";
import { ImageBlock } from "./ImageBlock";
import { VideoBlock } from "./VideoBlock";
import { MusicBlock } from "./MusicBlock";
import { MapBlock } from "./MapBlock";
import { ContactBlock } from "./ContactBlock";
import { EmailBlock } from "./EmailBlock";
import { PhoneBlock } from "./PhoneBlock";
import { WhatsAppBlock } from "./WhatsAppBlock";
import { BookingBlock } from "./BookingBlock";
import { FaqBlock } from "./FaqBlock";
import { GalleryBlock } from "./GalleryBlock";
import { CountdownBlock } from "./CountdownBlock";
import { CtaBlock } from "./CtaBlock";

interface BlockRendererProps {
  block: PublicProfileBlock | ProfileBlock;
  username?: string;
}

export function BlockRenderer({ block, username }: BlockRendererProps) {
  if (!block || !block.type || !block.config) {
    return null;
  }

  switch (block.type) {
    case "link":
      return (
        <LinkBlock
          config={block.config as LinkBlockConfig}
          blockId={block.id}
          profileId={block.profile_id}
        />
      );
    case "heading":
      return <HeadingBlock config={block.config as HeadingBlockConfig} />;
    case "text":
      return <TextBlock config={block.config as TextBlockConfig} />;
    case "divider":
      return <DividerBlock config={block.config as DividerBlockConfig} />;
    case "social":
      return (
        <div className="flex w-full justify-center">
          <SocialBlock config={block.config as SocialBlockConfig} />
        </div>
      );
    case "image":
      return <ImageBlock block={block as PublicProfileBlock<ImageBlockConfig>} />;
    case "video":
      return <VideoBlock block={block as PublicProfileBlock<VideoBlockConfig>} />;
    case "music":
      return <MusicBlock block={block as PublicProfileBlock<MusicBlockConfig>} />;
    case "map":
      return <MapBlock block={block as PublicProfileBlock<MapBlockConfig>} />;
    case "contact":
      return <ContactBlock block={block as PublicProfileBlock<ContactBlockConfig>} username={username} />;
    case "email":
      return <EmailBlock block={block as PublicProfileBlock<EmailBlockConfig>} />;
    case "phone":
      return <PhoneBlock block={block as PublicProfileBlock<PhoneBlockConfig>} />;
    case "whatsapp":
      return <WhatsAppBlock block={block as PublicProfileBlock<WhatsAppBlockConfig>} />;
    case "booking":
      return <BookingBlock block={block as PublicProfileBlock<BookingBlockConfig>} />;
    case "faq":
      return <FaqBlock block={block as PublicProfileBlock<FaqBlockConfig>} />;
    case "gallery":
      return <GalleryBlock block={block as PublicProfileBlock<GalleryBlockConfig>} />;
    case "countdown":
      return <CountdownBlock block={block as PublicProfileBlock<CountdownBlockConfig>} />;
    case "cta":
      return <CtaBlock block={block as PublicProfileBlock<CtaBlockConfig>} />;
    default:
      // Unknown block types fail safely without crashing
      return null;
  }
}
