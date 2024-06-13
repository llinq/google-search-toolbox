import { SingleDatepicker } from "chakra-dayzed-datepicker";

export type DatePickerprops = {
  name: string;
  date?: Date;
  onDateChange: (date: Date) => void;
}

export default function DatePicker({ name, date, onDateChange }: DatePickerprops) {
  const valueFormatted = date ? date.toISOString().substring(0, 10) : undefined;

  return (
    <>
      <input type="hidden" name={name} defaultValue={valueFormatted} />
      <SingleDatepicker
        maxDate={new Date()}
        date={date}
        onDateChange={onDateChange}
        propsConfigs={{
          triggerIconBtnProps: {
          },
          triggerBtnProps: {
            className: "",
            borderColor: "var(--chakra-colors-chakra-border-color)",
            color: "var(--chakra-colors-chakra-body-text)",
            _before: {
              content: date ? "''" : "'Choose date'"
            },
            _hover: {
              opacity: 0.5
            }
          },
          dayOfMonthBtnProps: {
            selectedBtnProps: {
              backgroundColor: "orange.600",
            },
            defaultBtnProps: {
              border: "1px solid",
              borderColor: "transparent",
              _hover: {
                "&:not(:disabled)": {
                  backgroundColor: "transparent",
                  borderColor: "orange.600",
                }
              }
            },
            todayBtnProps: {
              borderColor: "transparent"
            }
          }
        }}
      />
    </>
  );
}