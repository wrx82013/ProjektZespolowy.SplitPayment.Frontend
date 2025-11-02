interface HistoryItemProps {
  title: string;
  onEdit: () => void;
  onDelete: () => void;
}

function TrashIcon() {
  return (
    <div className="absolute top-[7px] left-[8px] size-[24px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g>
          <path
            d="M6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </div>
  );
}

function EditIcon() {
  return (
    <div className="absolute top-[7px] left-[8px] size-[24px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g>
          <path
            d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM3 21V16.75L16.2 3.575C16.4 3.39167 16.621 3.25 16.863 3.15C17.105 3.05 17.359 3 17.625 3C17.891 3 18.1493 3.05 18.4 3.15C18.6507 3.25 18.8673 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.771 5.4 20.863 5.65C20.955 5.9 21.0007 6.15 21 6.4C21 6.66667 20.9543 6.921 20.863 7.163C20.7717 7.405 20.6257 7.62567 20.425 7.825L7.25 21H3ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </div>
  );
}

export default function HistoryItem({
  title,
  onEdit,
  onDelete,
}: HistoryItemProps) {
  return (
    <div className="relative flex w-full shrink-0 content-stretch items-center gap-[16px]">
      <div className="relative box-border flex w-[541px] shrink-0 content-stretch items-center gap-[10px] rounded-[8px] p-[10px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[8px] border border-solid border-gray-900"
        />
        <p className="relative shrink-0 font-['Roboto_Flex:Regular',sans-serif]  leading-[normal] font-normal text-nowrap whitespace-pre text-gray-900 not-italic">
          {title}
        </p>
      </div>
      <div className="relative flex shrink-0 content-stretch items-center gap-[15px]">
        <button
          onClick={onDelete}
          className="relative size-[39px] shrink-0 rounded-[8px] bg-custom-red transition-colors hover:bg-custom-red-dark"
        >
          <TrashIcon />
        </button>
        <button
          onClick={onEdit}
          className="relative size-[39px] shrink-0 rounded-[8px] bg-custom-green transition-colors hover:bg-custom-green-dark"
        >
          <EditIcon />
        </button>
      </div>
    </div>
  );
}
