type IconProps = React.HTMLAttributes<SVGElement>


export const Icons = {
    goldCoin: (props: IconProps) => (<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={props.className} preserveAspectRatio="xMidYMid meet">

      
        <circle cx="100" cy="100" r="90" fill="gold" stroke="#d4af37" strokeWidth="10" />
      
        <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="5" />
      
        <text x="50%" y="50%" textAnchor="middle" fill="#d4af37" font-size="50" fontFamily="Arial" dy=".35em">Au</text>
      </svg>
      
    ),
    silverCoin: (props: IconProps) => (<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={props.className} preserveAspectRatio="xMidYMid meet">
        <circle cx="100" cy="100" r="90" fill="silver" stroke="#b0b0b0" strokeWidth="10" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="5" />
        <text x="50%" y="50%" textAnchor="middle" fill="#b0b0b0" fontSize="50" fontFamily="Arial" dy=".35em">Ag</text>
      </svg>
      
      
    )
}