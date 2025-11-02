interface DeleteButtonProps {
  onClick: () => void;
}

function TrashIcon() {
  return (
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g>
          <path d="M6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z" fill="var(--fill-0, black)" />
        </g>
      </svg>
  );
}

export default function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <button
      onClick={onClick}
      className="h-8 w-8 shrink-0 rounded-2 bg-red-500 transition-colors hover:bg-red-600"
    >
      <TrashIcon />
    </button>
  );
}
