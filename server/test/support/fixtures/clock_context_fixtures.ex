defmodule TimeTracker.ClockContextFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `TimeTracker.ClockContext` context.
  """

  @doc """
  Generate a clock.
  """
  def clock_fixture(attrs \\ %{}) do
    default_attrs = %{
      "status" => true,
      "time" => ~U[2024-10-06 14:18:00Z]
    }

    # Fusionne les attributs passés avec les valeurs par défaut
    merged_attrs = Enum.into(attrs, default_attrs)

    # Si l'attribut "time" est nil ou invalide, utilise une valeur par défaut
    time =
      case Map.get(merged_attrs, "time") do
        nil -> ~U[2024-10-06 14:18:00Z]
        datetime when is_binary(datetime) ->
          case DateTime.from_iso8601(datetime) do
            {:ok, dt, _} -> dt
            _ -> ~U[2024-10-06 14:18:00Z]
          end
        dt -> dt
      end

    merged_attrs = Map.put(merged_attrs, "time", time)

    {:ok, clock} = TimeTracker.ClockContext.create_clock(merged_attrs)
    clock
  end


end
