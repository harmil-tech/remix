type Props = { message: string };

export default function ErrorAlert({ message }: Props) {
  return (
    <div
      role="alert"
      style={{
        marginTop: '1rem',
        padding: '1rem',
        background: '#fee',
        color: '#c33',
        border: '1px solid #fcc',
        borderRadius: 6,
      }}
    >
      {message}
    </div>
  );
}
