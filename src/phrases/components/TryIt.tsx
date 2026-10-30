import { useId, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { Segmented } from '../../components/Segmented'
import { phraseUi } from '../../content'
import { cleanText, MAX_TEXT } from '../code'
import type { Control, Value, Values } from '../types'

const copy = phraseUi.controls
const field = 'h-11 w-full min-w-0 rounded-full border border-ink/25 bg-white px-4 placeholder:text-subtle'

function ListInput({ control, items, onChange }: { control: Extract<Control, { kind: 'list' }>; items: string[]; onChange: (items: string[]) => void }) {
  const [draft, setDraft] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const id = useId()
  const full = items.length >= control.max
  return (
    <fieldset>
      <legend className="mb-2 font-semibold">{control.label}</legend>
      {items.length === 0 ? (
        <p className="text-muted">{copy.empty}</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <li key={i} className="inline-flex max-w-full items-center rounded-full border border-ink/25 bg-white pl-4">
              <span className="min-w-0 [overflow-wrap:anywhere]">{item}</span>
              <button
                type="button"
                aria-label={copy.remove(item)}
                onClick={() => {
                  onChange(items.filter((_, j) => j !== i))
                  input.current?.focus()
                }}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-canvas"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <form
        className="mt-3 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          const item = cleanText(draft).trim()
          if (!item || full) return
          onChange([...items, item])
          setDraft('')
        }}
      >
        <label htmlFor={id} className="sr-only">
          {copy.newItem}
        </label>
        <input
          ref={input}
          id={id}
          value={draft}
          maxLength={MAX_TEXT}
          autoComplete="off"
          placeholder={copy.newItem}
          disabled={full}
          onChange={(event) => setDraft(event.target.value)}
          className={field}
        />
        <button type="submit" disabled={full || !draft.trim()} className="btn btn-dark shrink-0">
          {copy.add}
        </button>
      </form>
      {full && <p className="mt-2 text-sm text-muted">{copy.full(control.max)}</p>}
    </fieldset>
  )
}

function ControlInput({ control, value, onChange }: { control: Control; value: Value; onChange: (value: Value) => void }) {
  const id = useId()
  switch (control.kind) {
    case 'text':
      return (
        <div>
          <label htmlFor={id} className="font-semibold">
            {control.label}
          </label>
          <input
            id={id}
            type="text"
            value={String(value)}
            maxLength={MAX_TEXT}
            autoComplete="off"
            spellCheck={false}
            onChange={(event) => onChange(cleanText(event.target.value))}
            className={`mt-2 ${field}`}
          />
        </div>
      )
    case 'number':
      return (
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor={id} className="font-semibold">
              {control.label}
            </label>
            <output htmlFor={id} className="font-mono text-xl font-bold text-orange-dark">
              {String(value)}
            </output>
          </div>
          <input
            id={id}
            type="range"
            min={control.min}
            max={control.max}
            step={1}
            value={Number(value)}
            onChange={(event) => onChange(Number(event.target.value))}
            className="mt-1 h-11 w-full cursor-pointer accent-violet"
          />
        </div>
      )
    case 'yesno':
      return (
        <Segmented
          label={control.label}
          value={value === true}
          onChange={onChange}
          options={[
            { value: true, label: copy.yes },
            { value: false, label: copy.no },
          ]}
        />
      )
    case 'choice':
      return <Segmented label={control.label} value={String(value)} onChange={onChange} options={control.options} />
    case 'list':
      return <ListInput control={control} items={Array.isArray(value) ? value : []} onChange={onChange} />
  }
}

export function TryIt({ controls, values, onChange }: { controls: Control[]; values: Values; onChange: (id: string, value: Value) => void }) {
  return (
    <section aria-labelledby="change-it" className="rounded-card border border-line bg-white p-6 shadow-soft">
      <h2 id="change-it" className="text-xl font-bold">
        {phraseUi.tryIt}
      </h2>
      <p className="mt-1 leading-relaxed text-muted">{phraseUi.tryItText}</p>
      <div className="mt-5 flex flex-col gap-6">
        {controls.map((control) => (
          <ControlInput key={control.id} control={control} value={values[control.id]} onChange={(value) => onChange(control.id, value)} />
        ))}
      </div>
    </section>
  )
}
