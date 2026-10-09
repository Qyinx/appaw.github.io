export type SnkrBuybackPrice = {
  date: string;
  card_id: string;
  card_name: string;
  card_name_en: string;
  card_number: string;
  psa_grade: string;
  buyback_price: number;
  currency: string;
  price_source: string;
  source_post_url: string;
  image_url: string;
  notes: string;
};

export type SnkrBuybackAnnouncement = {
  date: string;
  label: string;
  source_post_url: string;
  notes: string;
};
