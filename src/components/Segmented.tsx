import { useId } from 'react'

type Option<T> = { value: T; label: string }

// Pick one of a few options: real radio buttons, drawn as pills. The arrow keys move between them, and the
// focus ring is drawn on the pill, since the radio itself is hidden.
export function Segmented<T extends string | boolean>({
  label,
  options,
  value,
  onChange,
  inline = false,
}: {
  label: string
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  // Put the label on the same line as the options.
  inline?: boolean
}) {
  const name = useId()
  return (
    <fieldset className={inline ? 'flex flex-wrap items-center gap-x-3 gap-y-2' : ''}>
      <legend className={`font-semibold ${inline ? 'float-left' : 'mb-2'}`}>{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={String(option.value)}
            className="relative inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full border border-ink/25 bg-white px-4 font-semibold transition-colors hover:border-ink has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-white has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-[3px] has-[:focus-visible]:outline-violet"
          >
            <input
              type="radio"
              name={name}
              className="sr-only focus-visible:outline-none"
              checked={option.value === value}
              onChange={() => onChange(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
