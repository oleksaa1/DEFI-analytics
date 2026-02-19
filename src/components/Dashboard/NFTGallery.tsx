'use client';

import { useNFTs } from '@/hooks/useNFTs';
import { ExternalLink, Image as ImageIcon } from 'lucide-react';

export default function NFTGallery() {
  const { data, isLoading, error } = useNFTs();

  if (isLoading) {
    return (
      <div className="rounded-xl bg-card border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">NFT Collection</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg bg-secondary animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-card border border-border p-6">
        <h3 className="text-lg font-semibold mb-2">NFT Collection</h3>
        <p className="text-muted-foreground text-sm">Failed to load NFTs</p>
      </div>
    );
  }

  const nfts = data?.result || [];

  return (
    <div className="rounded-xl bg-card border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">NFT Collection</h3>
        <span className="text-xs text-muted-foreground">
          {nfts.length} NFTs
        </span>
      </div>

      {nfts.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No NFTs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-1">
          {nfts.map((nft) => {
            const imageUrl =
              nft.media?.media_collection?.medium?.url ||
              nft.media?.original_media_url ||
              nft.normalized_metadata?.image ||
              null;

            const name =
              nft.normalized_metadata?.name || nft.name || `#${nft.token_id}`;

            return (
              <div
                key={`${nft.token_address}-${nft.token_id}`}
                className="group rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-colors"
              >
                {/* NFT Image */}
                <div className="aspect-square bg-secondary relative">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}

                  {/* Floor price badge */}
                  {nft.floor_price_usd && nft.floor_price_usd > 0 && (
                    <div className="absolute top-2 right-2 bg-card/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[10px] font-medium">
                      ${nft.floor_price_usd.toFixed(2)}
                    </div>
                  )}
                </div>

                {/* NFT Info */}
                <div className="p-2">
                  <p className="text-xs font-medium truncate">{name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] text-muted-foreground truncate">
                      {nft.symbol || nft.name}
                    </p>
                    <a
                      href={`https://bscscan.com/token/${nft.token_address}?a=${nft.token_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
