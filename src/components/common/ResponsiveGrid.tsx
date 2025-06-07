import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { getGridColumns, getCardWidth } from "../../utils/responsive";
import { responsiveTheme } from "../../styles/responsiveTheme";

interface ResponsiveGridProps {
  children: React.ReactNode[];
  columns?: number;
  spacing?: number;
  style?: ViewStyle;
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns,
  spacing = responsiveTheme.spacing.md,
  style,
}) => {
  const numColumns = columns || getGridColumns();
  const itemWidth = getCardWidth(numColumns, spacing);

  const renderRows = () => {
    const rows = [];
    for (let i = 0; i < children.length; i += numColumns) {
      const rowItems = children.slice(i, i + numColumns);
      rows.push(
        <View key={i} style={[styles.row, { marginBottom: spacing }]}>
          {rowItems.map((child, index) => (
            <View
              key={index}
              style={[
                styles.item,
                {
                  width: itemWidth,
                  marginRight: index < rowItems.length - 1 ? spacing : 0,
                },
              ]}
            >
              {child}
            </View>
          ))}
          {/* Fill empty spaces in the last row */}
          {rowItems.length < numColumns &&
            Array.from({ length: numColumns - rowItems.length }).map(
              (_, index) => (
                <View
                  key={`empty-${index}`}
                  style={{
                    width: itemWidth,
                    marginRight:
                      index < numColumns - rowItems.length - 1 ? spacing : 0,
                  }}
                />
              ),
            )}
        </View>,
      );
    }
    return rows;
  };

  return <View style={[styles.container, style]}>{renderRows()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  item: {
    flex: 0,
  },
});

export default ResponsiveGrid;
