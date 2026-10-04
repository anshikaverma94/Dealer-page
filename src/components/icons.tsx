type IconProps = {
  className?: string;
};

export function UserIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth={5.5}
        d="M35 39.84v-2.53c3.3-1.91 6-6.66 6-11.41 0-7.63 0-13.82-9-13.82s-9 6.19-9 13.82c0 4.75 2.7 9.51 6 11.41v2.53c-10.18.85-18 6-18 12.16h42c0-6.19-7.82-11.31-18-12.16z"
      />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth={5.5}
        d="M47.16 28.58A18.58 18.58 0 1 1 28.58 10a18.58 18.58 0 0 1 18.58 18.58zM54 54L41.94 42"
      />
    </svg>
  );
}

export function BagIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth={5.5}>
        <path d="M25 26c0-15.79 3.57-20 8-20s8 4.21 8 20" />
        <path d="M14.74 18h36.51l3.59 36.73h-43.7z" />
      </g>
    </svg>
  );
}

export function HamburgerIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64" className={className}>
      <path fill="none" stroke="currentColor" strokeWidth={6} d="M7 15h51M7 32h43M7 49h51" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64" className={className}>
      <path fill="none" stroke="currentColor" strokeWidth={6} d="M19 17.61l27.12 27.13m0-27.12L19 44.74" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 28 16" className={className}>
      <path
        d="M1.57 1.59l12.76 12.77L27.1 1.59"
        strokeWidth={3.5}
        stroke="currentColor"
        fill="none"
        fillRule="evenodd"
      />
    </svg>
  );
}

export function EmailIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        d="M63 52H1V12h62zM1 12l25.68 24h9.72L63 12M21.82 31.68L1.56 51.16m60.78.78L41.27 31.68"
      />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 32 32" className={className}>
      <path
        fill="currentColor"
        d="M16 3.094c4.206 0 4.7.019 6.363.094 1.538.069 2.369.325 2.925.544.738.287 1.262.625 1.813 1.175s.894 1.075 1.175 1.813c.212.556.475 1.387.544 2.925.075 1.662.094 2.156.094 6.363s-.019 4.7-.094 6.363c-.069 1.538-.325 2.369-.544 2.925-.288.738-.625 1.262-1.175 1.813s-1.075.894-1.813 1.175c-.556.212-1.387.475-2.925.544-1.663.075-2.156.094-6.363.094s-4.7-.019-6.363-.094c-1.537-.069-2.369-.325-2.925-.544-.737-.288-1.263-.625-1.813-1.175s-.894-1.075-1.175-1.813c-.212-.556-.475-1.387-.544-2.925-.075-1.663-.094-2.156-.094-6.363s.019-4.7.094-6.363c.069-1.537.325-2.369.544-2.925.287-.737.625-1.263 1.175-1.813s1.075-.894 1.813-1.175c.556-.212 1.388-.475 2.925-.544 1.662-.081 2.156-.094 6.363-.094zM16 7.912a8.088 8.088 0 1 0 0 16.175 8.088 8.088 0 0 0 0-16.175zm0 13.338a5.25 5.25 0 1 1 0-10.5 5.25 5.25 0 0 1 0 10.5zM26.294 7.594a1.887 1.887 0 1 1-3.774.002 1.887 1.887 0 0 1 3.774-.003z"
      />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 14222 14222" className={className}>
      <path
        fill="currentColor"
        d="M14222 7112c0 3549.352-2600.418 6491.344-6000 7024.72V9168h1657l315-2056H8222V5778c0-562 275-1111 1159-1111h897V2917s-814-139-1592-139c-1624 0-2686 984-2686 2767v1567H4194v2056h1806v4968.72C2600.418 13603.344 0 10661.352 0 7112 0 3184.703 3183.703 1 7111 1s7111 3183.703 7111 7111z"
      />
    </svg>
  );
}

export function YoutubeIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 21 20" className={className}>
      <path
        fill="currentColor"
        d="M-.196 15.803q0 1.23.812 2.092t1.977.861h14.946q1.165 0 1.977-.861t.812-2.092V3.909q0-1.23-.82-2.116T17.539.907H2.593q-1.148 0-1.969.886t-.82 2.116v11.894zm7.465-2.149V6.058q0-.115.066-.18.049-.016.082-.016l.082.016 7.153 3.806q.066.066.066.164 0 .066-.066.131l-7.153 3.806q-.033.033-.066.033-.066 0-.098-.033-.066-.066-.066-.131z"
      />
    </svg>
  );
}

export function TwitterIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 32 32" className={className}>
      <path
        fill="currentColor"
        d="M31.281 6.733q-1.304 1.924-3.13 3.26 0 .13.033.408t.033.408q0 2.543-.75 5.086t-2.282 4.858-3.635 4.108-5.053 2.869-6.341 1.076q-5.282 0-9.65-2.836.913.065 1.5.065 4.401 0 7.857-2.673-2.054-.033-3.668-1.255t-2.266-3.146q.554.13 1.206.13.88 0 1.663-.261-2.184-.456-3.619-2.184t-1.435-3.977v-.065q1.239.652 2.836.717-1.271-.848-2.021-2.233t-.75-2.983q0-1.63.815-3.195 2.38 2.967 5.754 4.678t7.319 1.907q-.228-.815-.228-1.434 0-2.608 1.858-4.45t4.532-1.842q1.304 0 2.51.522t2.054 1.467q2.152-.424 4.01-1.532-.685 2.217-2.771 3.488 1.989-.261 3.619-.978z"
      />
    </svg>
  );
}

export function LinkedinIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className={className}>
      <path
        fill="currentColor"
        d="M4.98 3.5C4.98 4.881 3.87 6 2.5 6S.02 4.881.02 3.5C.02 2.12 1.13 1 2.5 1s2.48 1.12 2.48 2.5zM5 8H0v16h5V8zm7.982 0H8.014v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0V24H24V13.869c0-7.88-8.922-7.593-11.018-3.714V8z"
      />
    </svg>
  );
}

export function WhatsappIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 32 32" className={className} fill="currentColor">
      <path d="M16.004 2.667c-7.363 0-13.333 5.97-13.333 13.333 0 2.351.617 4.616 1.789 6.613L2.667 29.333l6.876-1.763a13.27 13.27 0 0 0 6.46 1.646h.006c7.362 0 13.332-5.97 13.332-13.333S23.366 2.667 16.004 2.667zm0 24.4a11.05 11.05 0 0 1-5.633-1.542l-.404-.24-4.08 1.046 1.09-3.977-.264-.408a11.03 11.03 0 0 1-1.692-5.879c0-6.107 4.968-11.075 11.086-11.075 2.962 0 5.746 1.154 7.84 3.25a11.01 11.01 0 0 1 3.244 7.834c0 6.107-4.968 11.075-11.086 11.075zm6.08-8.294c-.334-.167-1.97-.972-2.275-1.083-.305-.111-.527-.167-.75.167-.222.333-.86 1.083-1.055 1.305-.194.222-.389.25-.722.083-.334-.167-1.409-.52-2.684-1.657-.992-.885-1.663-1.978-1.858-2.312-.194-.334-.02-.514.146-.68.15-.15.334-.389.5-.583.167-.195.223-.334.334-.556.111-.223.056-.417-.028-.584-.083-.167-.75-1.808-1.028-2.475-.271-.65-.546-.563-.75-.573l-.639-.011c-.222 0-.583.083-.888.417-.305.333-1.166 1.14-1.166 2.78s1.194 3.226 1.361 3.448c.167.222 2.352 3.59 5.696 5.036.796.343 1.417.548 1.901.702.799.254 1.526.218 2.101.132.641-.096 1.97-.806 2.248-1.584.278-.778.278-1.445.194-1.584-.083-.14-.305-.223-.639-.39z" />
    </svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M6.62 10.79a15.1 15.1 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.4 11.4 0 0 0 3.58.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.58 1 1 0 0 1-.25 1.02z" />
    </svg>
  );
}

export function ArrowUpIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className={className}>
      <path
        d="M12 19V5M5 12l7-7 7 7"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20" className={className} fill="currentColor">
      <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.8L10 14.77l-5.21 2.75 1-5.8-4.21-4.1 5.82-.85z" />
    </svg>
  );
}
