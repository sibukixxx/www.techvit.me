// Pre-generated responsive WebP variants live in public/images/grave-care/.
// All five images are AI-generated service illustrations, not photographs of
// actual work or of any specific cemetery. Replace with real photography once
// permitted work examples exist.

export interface GraveCareImage {
  /** File name stem inside public/images/grave-care/ (a `-<width>.webp` suffix is appended). */
  name: string;
  widths: readonly number[];
  /** Intrinsic dimensions of the largest variant, used for width/height attributes. */
  width: number;
  height: number;
  alt: string;
  altEn: string;
}

const WIDE = [480, 768, 1024, 1440] as const;

export const graveCareImages = {
  hero: {
    name: 'grave-care-tokyo-tama-hero',
    widths: WIDE,
    width: 1440,
    height: 811,
    alt: '緑に囲まれた東京・多摩地域のお墓を定期的に見守るサービスのイメージ',
    altEn:
      'A quiet, green cemetery in the Tokyo Tama area, visited regularly as part of the grave-care service',
  },
  cleaning: {
    name: 'grave-cleaning-hand-care',
    widths: WIDE,
    width: 1440,
    height: 960,
    alt: '墓石を布で丁寧に清掃するお墓見守りサービスのイメージ',
    altEn: 'A worker in uniform gently wiping a gravestone with a cloth, with a bucket and brush nearby',
  },
  photoReport: {
    name: 'grave-care-photo-report',
    widths: WIDE,
    width: 1440,
    height: 960,
    alt: '墓参り代行の作業前後をスマートフォンの写真で確認するイメージ',
    altEn: 'Hands holding a smartphone showing before-and-after photos of a grave, with the cemetery behind',
  },
  fourSeasons: {
    name: 'grave-care-four-seasons',
    widths: [480, 768, 1024, 1440, 1672],
    width: 1672,
    height: 941,
    alt: '春・夏・秋・冬を通じて年4回お墓を見守るサービスのイメージ',
    altEn: 'The same grave shown in spring, summer, autumn and winter, illustrating four visits a year',
  },
  hanno: {
    name: 'grave-care-west-tokyo-hanno',
    widths: WIDE,
    width: 1440,
    height: 811,
    alt: '緑豊かな丘陵地域にある墓地を定期訪問するイメージ',
    altEn: 'A cemetery on a green hillside with wooded hills and a town in the distance',
  },
} satisfies Record<string, GraveCareImage>;

export const graveCareImageSrc = (image: GraveCareImage, width: number) =>
  `/images/grave-care/${image.name}-${width}.webp`;

export const graveCareImageSrcSet = (image: GraveCareImage) =>
  image.widths.map((width) => `${graveCareImageSrc(image, width)} ${width}w`).join(', ');
