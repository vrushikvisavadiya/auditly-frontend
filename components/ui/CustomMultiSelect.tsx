// components/ui/CustomMultiSelect.tsx
"use client";
import Select, {
  MultiValue,
  ActionMeta,
  components,
  OptionProps,
  StylesConfig,
  GroupBase,
  ValueContainerProps,
} from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/Icon";
import { useMemo } from "react";

export interface OptionType {
  id: string;
  name: string;
}

interface CustomMultiSelectProps {
  options: OptionType[];
  selectedValues: OptionType[];
  onChange: (values: OptionType[]) => void;
  placeholder?: string;
  className?: string;
}

type RSOption = { value: string; label: string };

export default function CustomMultiSelect({
  options = [],
  selectedValues = [],
  onChange,
  placeholder = "",
  className = "",
}: CustomMultiSelectProps) {
  const toRS = (o: OptionType): RSOption => ({ value: o.id, label: o.name });
  const fromRS = (o: RSOption): OptionType => ({ id: o.value, name: o.label });

  const selectOptions = useMemo(() => options.map(toRS), [options]);
  const selectValues = useMemo(
    () => selectedValues.map(toRS),
    [selectedValues]
  );

  const handleSelectChange = (
    newValue: MultiValue<RSOption>,
    _meta: ActionMeta<RSOption>
  ) => {
    onChange(newValue ? newValue.map(fromRS) : []);
  };

  // Checkbox option row
  const CheckboxOption = (
    props: OptionProps<RSOption, true, GroupBase<RSOption>>
  ) => {
    const { isSelected, label } = props;
    return (
      <components.Option {...props}>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isSelected}
            readOnly
            className="h-4 w-4 rounded accent-[var(--auditly-orange)]"
          />
          <span>{label}</span>
        </div>
      </components.Option>
    );
  };

  /**
   * ValueContainer that keeps placeholder visible when there are selections
   * (but hides while typing to avoid overlap).
   * NOTE: ValueContainerProps doesn't include `isFocused`, so use `selectProps.menuIsOpen ?? false`
   * for the Placeholder's required `isFocused` prop.
   */
  const AlwaysPlaceholderValueContainer = (
    props: ValueContainerProps<RSOption, true>
  ) => {
    const { children, hasValue, selectProps } = props;
    const isTyping = Boolean(selectProps.inputValue);
    const isFocusedLike = selectProps.menuIsOpen ?? false;

    return (
      <components.ValueContainer {...props}>
        {hasValue && !isTyping && (
          <components.Placeholder
            {...props}
            isFocused={isFocusedLike}
            // position it like a ghost label
            innerProps={{
              style: {
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "#9ca3af",
                margin: 0,
              },
            }}
          >
            {selectProps.placeholder}
          </components.Placeholder>
        )}
        {children}
      </components.ValueContainer>
    );
  };

  const customStyles: StylesConfig<RSOption, true> = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "var(--auditly-dark-blue)" : "#d1d5db",
      borderWidth: 2,
      borderRadius: "0.5rem",
      padding: 8,
      minHeight: 50,
      boxShadow: state.isFocused ? "0 0 0 3px rgba(59,130,246,0.1)" : "none",
      ":hover": {
        borderColor: state.isFocused ? "var(--auditly-dark-blue)" : "#9ca3af",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
      position: "absolute",
    }),
    // Hide chips in the control; we show pills below instead
    multiValue: () => ({ display: "none" }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "var(--auditly-orange)"
        : state.isFocused
        ? "rgba(255, 120, 75, 0.10)"
        : "transparent",
      color: state.isSelected ? "#fff" : "#111827",
      ":active": {
        ...provided[":active"],
        backgroundColor: state.isSelected
          ? "var(--auditly-orange)"
          : "rgba(255,120,75,0.15)",
      },
    }),
    menuList: (provided) => ({
      ...provided,
      paddingTop: 6,
      paddingBottom: 6,
    }),
    // Ensure portaled menu overlays everything
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  const theme = (base: any) => ({
    ...base,
    colors: {
      ...base.colors,
      primary: "var(--auditly-orange)",
      primary25: "rgba(255, 120, 75, 0.15)",
      primary50: "rgba(255, 120, 75, 0.25)",
    },
  });

  // Use a stable instanceId to avoid SSR hydration warnings
  const instanceId = "custom-multi-select";

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Select
        instanceId={instanceId}
        isMulti
        options={selectOptions}
        value={selectValues}
        onChange={handleSelectChange}
        placeholder={placeholder}
        styles={customStyles}
        theme={theme}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        // Render the menu in a portal so outside clicks close it reliably
        menuPortalTarget={
          typeof window !== "undefined" ? document.body : undefined
        }
        menuShouldBlockScroll
        components={{
          Option: CheckboxOption,
          MultiValue: () => null,
          ValueContainer: AlwaysPlaceholderValueContainer, // ✅ fixed typing
          DropdownIndicator: (props) => (
            <components.DropdownIndicator {...props}>
              <Icon name="expand_more" className="text-gray-400 mr-2" />
            </components.DropdownIndicator>
          ),
          IndicatorSeparator: () => null,
        }}
      />

      {/* Selected values displayed below with removable "x" */}
      <AnimatePresence>
        {selectedValues.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap gap-2 mt-2"
          >
            {selectedValues.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-2 pl-3 pr-2 py-2 bg-[var(--auditly-orange)]/20 text-black text-sm rounded-md"
              >
                <span className="text-sm font-medium">{item.name}</span>
                <button
                  type="button"
                  aria-label={`Remove ${item.name}`}
                  onClick={() =>
                    onChange(selectedValues.filter((v) => v.id !== item.id))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onChange(selectedValues.filter((v) => v.id !== item.id));
                    }
                  }}
                  className=" items-center justify-center h-5 w-5 pr-4 pb-4 rounded-full cursor-pointer text-gray-600 hover:text-[var(--auditly-orange)]  focus:outline-none focus:ring-2 0 transition-colors"
                >
                  <Icon name="close" className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
