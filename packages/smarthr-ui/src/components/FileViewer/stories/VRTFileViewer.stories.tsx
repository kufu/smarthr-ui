import { FileViewer } from '../'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Components/FileViewer/VRT',
  render: (args) => <FileViewer {...args} />,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof FileViewer>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}

// export function useDocumentViewer({ url, contentType, filename, width }: Props) {
//   const [pdfNumPages, setPdfNumPages] = useState(1)
//   const [scale, setScale] = useState(1)
//   const [rotate, setRotate] = useState<RotationType>(0)
//
//   const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
//     setPdfNumPages(numPages)
//   }
//
//   const handleOnClickScaleUpButton = () => {
//     const statedScale = new Decimal(scale)
//     setScale(statedScale.add(SCALE_STEP).toNumber())
//   }
//
//   const handleOnClickScaleDownButton = () => {
//     const statedScale = new Decimal(scale)
//     setScale(statedScale.sub(SCALE_STEP).toNumber())
//   }
//
//   const handleOnClickRotateButton = () => {
//     setRotate(getRotatedAngle({ base: rotate }))
//   }
//
//   const viewer =
//     contentType === 'application/pdf' ? (
//       <Document
//         options={options}
//         file={url}
//         onLoadSuccess={onDocumentLoadSuccess}
//         rotate={rotate}
//         className="shr-h-full shr-flex shr-flex-col shr-gap-1 shr-items-center shr-w-fit"
//       >
//         {Array.from({ length: pdfNumPages }).map((_, i) => (
//           <Page
//             key={`page_${i + 1}`}
//             pageNumber={i + 1}
//             scale={scale}
//             className="shr-w-fit_ shr-w-full"
//           />
//         ))}
//       </Document>
//     ) : (
//       <div className="shr-origin-top-left" style={{ scale: `${scale}` }}>
//         <img
//           src={url}
//           alt={filename}
//           style={{ rotate: `${rotate}deg` }}
//           width={width}
//           className="markuplint-ignore-required-attr-height"
//         />
//       </div>
//     )
//
//   const controller = (
//     <div className="shr-flex shr-w-full shr-items-center shr-p-0.5 shr-gap-0.5 shr-sticky shr-justify-center shr-bg-scrim shr-shadow-layer-1">
//       <Button onClick={handleOnClickRotateButton} className="shr-p-0.75">
//         <FaArrowRotateRightIcon alt="右回転" />
//       </Button>
//       <Button onClick={handleOnClickScaleUpButton} className="shr-p-0.75">
//         <FaMagnifyingGlassPlusIcon alt="拡大" />
//       </Button>
//       <Button
//         onClick={handleOnClickScaleDownButton}
//         className="shr-p-0.75"
//         disabled={scale <= MIN_SCALE}
//       >
//         <FaMagnifyingGlassMinusIcon alt="縮小" />
//       </Button>
//     </div>
//   )
//
//   return { viewer, controller }
// }
