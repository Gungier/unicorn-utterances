import style from "./collection-card.module.scss";
import { Button } from "components/index";
import { ExtendedCollectionInfo } from "types/CollectionInfo";
import { ProfilePictureMap } from "utils/get-unicorn-profile-pic-map";
import forward from "src/icons/arrow_right.svg?raw";
import { Picture, Picture as UUPicture } from "components/image/picture";
import { JSXNode } from "components/types";
import { GetPictureResult } from "@astrojs/image/dist/lib/get-picture";

interface CollectionCardProps {
	collection: ExtendedCollectionInfo & { coverPicture?: GetPictureResult };
	unicornProfilePicMap: ProfilePictureMap;
}

export const CollectionCard = ({
	collection,
	unicornProfilePicMap,
}: CollectionCardProps) => {
	return (
		<div className={style.container}>
			<div className={style.topRow}>
				{collection.coverPicture ? (
					<Picture
						picture={collection.coverPicture}
						alt=""
						class={style.coverImg}
						imgAttrs={{loading: "lazy"}}
					/>
				) : (
					<img
						alt=""
						src={collection.coverImgMeta.relativeServerPath}
						loading="lazy"
						width={160}
						height={240}
						class={style.coverImg}
					/>
				)}
				<div>
					<h2 className={`text-style-headline-4 ${style.title}`}>
						{collection.title}
					</h2>
					<p className={`text-style-body-medium`}>{collection.description}</p>
				</div>
			</div>
			<div className={style.bottomRow}>
				<ul className={`unlist-inline ${style.authorList}`}>
					{collection.authorsMeta?.map((author) => (
						<li>
							<a
								href={`/unicorns/${author.id}`}
								className={`text-style-button-regular ${style.authorListItem}`}
							>
								<UUPicture
									picture={unicornProfilePicMap.find((u) => u.id === author.id)}
									alt={author.name}
									class={style.authorImage}
								/>
								<span>{author.name}</span>
							</a>
						</li>
					))}
				</ul>

				<Button
					href={`/collections/${collection.slug}`}
					rightIcon={
						<span
							className={style.forwardIcon}
							dangerouslySetInnerHTML={{ __html: forward }}
						/>
					}
				>
					{collection.customChaptersText ?? (
						<>{String(collection.posts.length)} chapters</>
					)}
				</Button>
			</div>
		</div>
	);
};
