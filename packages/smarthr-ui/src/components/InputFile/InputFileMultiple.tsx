import React, { ChangeEventHandler, ComponentPropsWithRef, forwardRef, useCallback, useEffect, useRef, useState } from "react";

import { mergeRefs } from "../../libs/mergeRefs";
import { FormControl } from "../FormControl";

type Props = ComponentPropsWithRef<'input'> & {
  files?: File[]
}

export const InputFileMultiple = forwardRef<HTMLInputElement, Props>((props, externalRef) => {
  const { files: externalFiles, onChange }= props
  const internalRef = useRef<HTMLInputElement>(null)
  const ref = mergeRefs(internalRef, externalRef)
  const [files, setFiles] = useState<File[]>([])

  console.log(files, internalRef?.current?.files)

  const syncNativeInputWithState = useCallback((fs: File[]) => {
    if (!internalRef.current) {
      return
    }
    if (fs.length === 0) {
      internalRef.current.value = ''
      return
    }
    console.log(fs)
    const dataTransfer = new DataTransfer()
    fs.forEach((file) => dataTransfer.items.add(file))
    internalRef.current.files = dataTransfer.files
  }, [])

  // 外部からファイルがsetされたらReactの状態にsetする
  useEffect(() => {
    const fs = externalFiles ? Array.from(externalFiles) : []
    setFiles(fs)
    syncNativeInputWithState(fs)
  }, [externalFiles, syncNativeInputWithState])

  // ファイルがReactの状態にsetされたらinput要素にもsetする
  // useEffect(() => {
  //   if (!internalRef.current) {
  //     return
  //   }
  //   const dataTransfer = new DataTransfer()
  //   files?.forEach((file) => dataTransfer.items.add(file))
  //   internalRef.current.files = dataTransfer.files
  // }, [files, externalFiles])

  // input要素にファイルが選択されたらReactの状態にもsetする
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const fs = Array.from(e?.target.files ?? [])
    setFiles(fs)
    syncNativeInputWithState(fs)
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
