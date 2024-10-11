defmodule TimeTracker.WorkingTimeContextFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `TimeTracker.WorkingTimeContext` context.
  """

  @doc """
  Generate a working_time.
  """
  def working_time_fixture(attrs \\ %{}) do
    default_attrs = %{
      "end" => ~U[2024-10-06 13:02:00Z],
      "start" => ~U[2024-10-06 13:02:00Z],
      "user_id" => 1
    }

    merged_attrs = Enum.into(attrs, default_attrs)

    {:ok, working_time} = TimeTracker.WorkingTimeContext.create_working_time(merged_attrs)
    working_time
  end

end
