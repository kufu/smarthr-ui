import React, { ChangeEventHandler, ComponentPropsWithRef, forwardRef, useEffect, useRef, useState } from "react";

import { mergeRefs } from "../../libs/mergeRefs";
import { FormControl } from "../FormControl";

type Props = ComponentPropsWithRef<'input'> & {
  files?: File[] | null
}

  export const InputFileMultiple = forwardRef<HTMLInputElement, Props>((props, externalRef) => {
    const { files: externalFiles, onChange }= props
    const internalRef = useRef<HTMLInputElement>(null)
    const ref = mergeRefs(internalRef, externalRef)
    const [files, setFiles] = useState<File[] | null>([])

    console.log(files, internalRef?.current?.files)

    useEffect(() => {
      if (!internalRef.current) {
        return
      }
      if (externalFiles === null) {
        setFiles(externalFiles)
        internalRef.current.files = null
        return
      }
    }, [externalFiles])

    useEffect(() => {
      if (!internalRef.current) {
        return
      }
      const dataTransfer = new DataTransfer()
      files?.forEach((file) => dataTransfer.items.add(file))
      internalRef.current.files = dataTransfer.files
    }, [files, externalFiles ])

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      setFiles(Array.from(e?.target.files ?? []))
      onChange?.(e)
    }

    return (
        <FormControl
          title="test"
        >
      <input
        {...props}
        onChange={handleChange}
        data-smarthr-ui-input="true"
        type="file"
        multiple
        ref={ref}
        aria-labelledby="ok"
      />
    </FormControl>
    )
  })
