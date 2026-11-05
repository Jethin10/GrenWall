/** The board is a single art direction, not a collection of invented clients. */
export function BoardArtwork({ index }: { index: number }) {
  return <svg className="cf-board-artwork" viewBox="0 0 600 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id={`board-shadow-${index}`} x="-60%" y="-60%" width="220%" height="220%"><feDropShadow dx="3" dy="15" stdDeviation="12" floodOpacity=".18" /></filter>
      <linearGradient id={`board-metal-${index}`} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#f5f5f2"/><stop offset=".32" stopColor="#53534e"/><stop offset=".48" stopColor="#eeeee8"/><stop offset=".61" stopColor="#88887e"/><stop offset="1" stopColor="#f5f5f0"/></linearGradient>
    </defs>
    <g fontFamily="'Inter Variable',Arial,sans-serif" fill="#101010">
      {index === 0 && <>
        <rect width="600" height="480" fill="#111110"/>
        <text x="30" y="43" fill="#e8e8df" fontSize="14">Craftflow®</text><text x="400" y="43" fill="#99998e" fontSize="12">Identity in motion</text>
        <g transform="translate(300 244) rotate(-20)"><path d="M153-126A198 198 0 1 0 153 126L88 70a112 112 0 1 1 0-140Z" fill="#eeeeE8"/><path d="M-5-42h196v84H-5Z" fill="#c8ad71"/></g>
        <text x="30" y="450" fill="#a0a096" fontSize="12">A different angle.</text>
      </>}
      {index === 1 && <>
        <rect width="600" height="480" fill="#d9d9d4"/>
        <g transform="translate(40 42)" filter={`url(#board-shadow-${index})`}>
          <rect width="520" height="398" fill="#f7f7f3"/>
          <text x="22" y="30" fontSize="20" fontWeight="650" letterSpacing="-1">perspective.</text><text x="358" y="28" fontSize="9">Journal</text><text x="417" y="28" fontSize="9">About</text><text x="470" y="28" fontSize="9">↗</text>
          <path d="M22 48h476" stroke="#ccc" strokeWidth=".7"/>
          <text x="20" y="103" fontSize="47" letterSpacing="-2.5">A fresh way</text><text x="20" y="154" fontFamily="'Instrument Serif',Georgia,serif" fontSize="55">of looking.</text>
          <image href="/images/chrome-liquid.webp" x="22" y="183" width="476" height="159" preserveAspectRatio="xMidYMid slice"/>
          <text x="22" y="373" fontSize="10">Design, culture and a change of perspective.</text><path d="m470 362 9 9-9 9" fill="none" stroke="#111"/>
        </g>
      </>}
      {index === 2 && <>
        <rect width="600" height="480" fill="#c3aa73"/>
        <text x="30" y="43" fontSize="14">forme / Objects of intention</text>
        <text x="30" y="382" fontFamily="'Instrument Serif',Georgia,serif" fontSize="445" letterSpacing="-20">f.</text>
        <text x="30" y="450" fontSize="12">Form follows feeling.</text>
      </>}
      {index === 3 && <>
        <rect width="600" height="480" fill="#bcbdb7"/>
        <g transform="translate(280 225) rotate(-14)" filter={`url(#board-shadow-${index})`}>
          <rect x="-172" y="-153" width="344" height="306" fill="#eeeee7"/>
          <text x="-146" y="-111" fontSize="17" fontWeight="550">liquid matter.</text>
          <image href="/images/chrome-liquid.webp" x="-146" y="-70" width="292" height="175" preserveAspectRatio="xMidYMid slice"/>
          <text x="-146" y="133" fontSize="10">An identity with a life of its own.</text>
        </g>
        <g transform="translate(424 333) rotate(13)" filter={`url(#board-shadow-${index})`}><rect x="-110" y="-65" width="220" height="130" fill="#141413"/><text x="-90" y="13" fontFamily="'Instrument Serif',Georgia,serif" fontSize="73" fill="#d1b67e">lm.</text></g>
      </>}
      {index === 4 && <>
        <rect width="600" height="480" fill="#e9e9e2"/>
        <g transform="translate(20 40)"><text x="0" y="0" fontSize="12">FRAMEWORK</text><text x="420" y="0" fontSize="12">A digital system</text></g>
        <g transform="translate(26 84)">
          <rect width="548" height="310" fill="#141413"/>
          <text x="20" y="31" fontSize="15" fontWeight="600" fill="#f3f3ed">craftflow.</text><path d="M501 19h26m-26 5h26" stroke="#eee"/>
          <text x="20" y="102" fontSize="50" fill="#eeeee7" letterSpacing="-3">Made to move.</text>
          <rect x="20" y="129" width="160" height="151" fill="#c3aa73"/><path d="m57 239 78-78m-78 0h78v78" fill="none" stroke="#111" strokeWidth="11"/>
          <image href="/images/chrome-liquid.webp" x="192" y="129" width="160" height="151" preserveAspectRatio="xMidYMid slice"/>
          <rect x="364" y="129" width="164" height="151" fill="#e9e9e2"/><text x="379" y="245" fontFamily="'Instrument Serif',Georgia,serif" fontSize="131">Aa</text>
        </g><text x="26" y="449" fontSize="12">One idea. Across every screen.</text>
      </>}
      {index === 5 && <>
        <image href="/images/silk-drape.webp" width="600" height="480" preserveAspectRatio="xMidYMid slice"/>
        <text x="30" y="43" fontSize="14">Still / A material practice</text>
        <text x="300" y="256" textAnchor="middle" fontFamily="'Instrument Serif',Georgia,serif" fontSize="170" letterSpacing="-7">Still.</text>
        <text x="30" y="450" fontSize="12">Space to feel something.</text>
      </>}
      {index === 6 && <>
        <rect width="600" height="480" fill="#f2f2eb"/>
        <text x="28" y="41" fontSize="13">THE SHAPE OF A LETTER</text>
        <text x="5" y="422" fontFamily="'Bodoni Moda Variable',Georgia,serif" fontSize="485" fontWeight="900" letterSpacing="-25">R</text>
        <rect x="490" y="360" width="80" height="80" fill="#c3aa73"/>
      </>}
      {index === 7 && <>
        <rect width="600" height="480" fill="#171715"/>
        <text x="30" y="43" fontSize="14" fill="#dddcd3">Field / Graphic identity</text>
        {Array.from({ length: 18 }, (_, i) => <ellipse key={i} cx="300" cy="238" rx={205 - i * 8} ry={160 - i * 3} transform={`rotate(${i * 10} 300 238)`} fill="none" stroke={i % 4 === 0 ? '#c3aa73' : '#e4e4d9'} strokeWidth="1.5" />)}
        <text x="30" y="450" fontSize="14" fill="#dddcd3">Room for a different perspective.</text>
      </>}
    </g>
  </svg>;
}
